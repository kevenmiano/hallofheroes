

(function(self) {
	'use strict';

	if (self.fetch) {
		return
	}

	function normalizeName(name) {
		if (typeof name !== 'string') {
			name = name.toString();
		}
		if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
			throw new TypeError('Invalid character in header field name')
		}
		return name.toLowerCase()
	}

	function normalizeValue(value) {
		if (typeof value !== 'string') {
			value = value.toString();
		}
		return value
	}

	function Headers(headers) {
		this.map = {}

		var self = this
		if (headers instanceof Headers) {
			headers.forEach(function(name, values) {
				values.forEach(function(value) {
					self.append(name, value)
				})
			})

		} else if (headers) {
			Object.getOwnPropertyNames(headers).forEach(function(name) {
				self.append(name, headers[name])
			})
		}
	}

	Headers.prototype.append = function(name, value) {
		name = normalizeName(name)
		value = normalizeValue(value)
		var list = this.map[name]
		if (!list) {
			list = []
			this.map[name] = list
		}
		list.push(value)
	}

	Headers.prototype['delete'] = function(name) {
		delete this.map[normalizeName(name)]
	}

	Headers.prototype.get = function(name) {
		var values = this.map[normalizeName(name)]
		return values ? values[0] : null
	}

	Headers.prototype.getAll = function(name) {
		return this.map[normalizeName(name)] || []
	}

	Headers.prototype.has = function(name) {
		return this.map.hasOwnProperty(normalizeName(name))
	}

	Headers.prototype.set = function(name, value) {
		this.map[normalizeName(name)] = [normalizeValue(value)]
	}

	// Instead of iterable for now.
	Headers.prototype.forEach = function(callback) {
		var self = this
		Object.getOwnPropertyNames(this.map).forEach(function(name) {
			callback(name, self.map[name])
		})
	}

	function consumed(body) {
		if (body.bodyUsed) {
			return fetch.Promise.reject(new TypeError('Already read'))
		}
		body.bodyUsed = true
	}

	function fileReaderReady(reader) {
		return new fetch.Promise(function(resolve, reject) {
			reader.onload = function() {
				resolve(reader.result)
			}
			reader.onerror = function() {
				reject(reader.error)
			}
		})
	}

	function readBlobAsArrayBuffer(blob) {
		var reader = new FileReader()
		reader.readAsArrayBuffer(blob)
		return fileReaderReady(reader)
	}

	function readBlobAsText(blob) {
		var reader = new FileReader()
		reader.readAsText(blob)
		return fileReaderReady(reader)
	}

	var support = {
		blob: 'FileReader' in self && 'Blob' in self && (function() {
			try {
				new Blob();
				return true
			} catch(e) {
				return false
			}
		})(),
		formData: 'FormData' in self
	}

	function Body() {
		this.bodyUsed = false


		this._initBody = function(body) {
			this._bodyInit = body
			if (typeof body === 'string') {
				this._bodyText = body
			} else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
				this._bodyBlob = body
			} else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
				this._bodyFormData = body
			} else if (!body) {
				this._bodyText = ''
			} else {
				throw new Error('unsupported BodyInit type')
			}
		}

		if (support.blob) {
			this.blob = function() {
				var rejected = consumed(this)
				if (rejected) {
					return rejected
				}

				if (this._bodyBlob) {
					return fetch.Promise.resolve(this._bodyBlob)
				} else if (this._bodyFormData) {
					throw new Error('could not read FormData body as blob')
				} else {
					return fetch.Promise.resolve(new Blob([this._bodyText]))
				}
			}

			this.arrayBuffer = function() {
				return this.blob().then(readBlobAsArrayBuffer)
			}

			this.text = function() {
				var rejected = consumed(this)
				if (rejected) {
					return rejected
				}

				if (this._bodyBlob) {
					return readBlobAsText(this._bodyBlob)
				} else if (this._bodyFormData) {
					throw new Error('could not read FormData body as text')
				} else {
					return fetch.Promise.resolve(this._bodyText)
				}
			}
		} else {
			this.text = function() {
				var rejected = consumed(this)
				return rejected ? rejected : fetch.Promise.resolve(this._bodyText)
			}
		}

		if (support.formData) {
			this.formData = function() {
				return this.text().then(decode)
			}
		}

		this.json = function() {
			return this.text().then(function (text) {
				return JSON.parse(text);
			});
		}

		return this
	}

	// HTTP methods whose capitalization should be normalized
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	function normalizeMethod(method) {
		var upcased = method.toUpperCase()
		return (methods.indexOf(upcased) > -1) ? upcased : method
	}

	function Request(url, options) {
		options = options || {}
		this.url = url

		this.credentials = options.credentials || 'omit'
		this.headers = new Headers(options.headers)
		this.method = normalizeMethod(options.method || 'GET')
		this.mode = options.mode || null
		this.referrer = null

		if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
			throw new TypeError('Body not allowed for GET or HEAD requests')
		}
		this._initBody(options.body)
	}

	function decode(body) {
		var form = new FormData()
		body.trim().split('&').forEach(function(bytes) {
			if (bytes) {
				var split = bytes.split('=')
				var name = split.shift().replace(/\+/g, ' ')
				var value = split.join('=').replace(/\+/g, ' ')
				form.append(decodeURIComponent(name), decodeURIComponent(value))
			}
		})
		return form
	}

	function headers(xhr) {
		var head = new Headers()
		var pairs = xhr.getAllResponseHeaders().trim().split('\n')
		pairs.forEach(function(header) {
			var split = header.trim().split(':')
			var key = split.shift().trim()
			var value = split.join(':').trim()
			head.append(key, value)
		})
		return head
	}

	var noXhrPatch =
		typeof window !== 'undefined' && !!window.ActiveXObject &&
		!(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

	function getXhr() {
		// from backbone.js 1.1.2
		// https://github.com/jashkenas/backbone/blob/1.1.2/backbone.js#L1181
		if (noXhrPatch && !(/^(get|post|head|put|delete|options)$/i.test(this.method))) {
			this.usingActiveXhr = true;
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		return new XMLHttpRequest();
	}

	Body.call(Request.prototype)

	function Response(bodyInit, options) {
		if (!options) {
			options = {}
		}

		this._initBody(bodyInit)
		this.type = 'default'
		this.url = null
		this.status = options.status
		this.ok = this.status >= 200 && this.status < 300
		this.statusText = options.statusText
		this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
		this.url = options.url || ''
	}

	Body.call(Response.prototype)

	self.Headers = Headers;
	self.Request = Request;
	self.Response = Response;

	self.fetch = function(input, init) {
		// TODO: Request constructor should accept input, init
		var request
		if (Request.prototype.isPrototypeOf(input) && !init) {
			request = input
		} else {
			request = new Request(input, init)
		}

		return new fetch.Promise(function(resolve, reject) {
			var xhr = getXhr();
            // xhr.timeout = 5000;
			if (request.credentials === 'cors') {
				xhr.withCredentials = true;
			}

			function responseURL() {
				if ('responseURL' in xhr) {
					return xhr.responseURL
				}

				// Avoid security warnings on getResponseHeader when not allowed by CORS
				if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
					return xhr.getResponseHeader('X-Request-URL')
				}

				return;
			}

			function onload() {
				if (xhr.readyState !== 4) {
					return
				}
				var status = (xhr.status === 1223) ? 204 : xhr.status
				if (status < 100 || status > 599) {
					reject(new TypeError('Network request failed'))
					return
				}
				var options = {
					status: status,
					statusText: xhr.statusText,
					headers: headers(xhr),
					url: responseURL()
				}
				var body = 'response' in xhr ? xhr.response : xhr.responseText;
				resolve(new Response(body, options))
			}
			xhr.onreadystatechange = onload;
			if (!self.usingActiveXhr) {
				xhr.onload = onload;
				xhr.onerror = function() {
					reject(new TypeError('Network request failed'))
				}
			}

			xhr.open(request.method, request.url, true)

			if ('responseType' in xhr && support.blob) {
				xhr.responseType = 'blob'
			}

			request.headers.forEach(function(name, values) {
				values.forEach(function(value) {
					xhr.setRequestHeader(name, value)
				})
			})
            //我们只需要加上下面这段代码即可
            if(init!=null&&init.timeout!=null){
                xhr.timeout=init.timeout;
            }
			xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
		})
	}

	fetch.Promise = self.Promise; // you could change it to your favorite alternative
	self.fetch.polyfill = true
})(window);
