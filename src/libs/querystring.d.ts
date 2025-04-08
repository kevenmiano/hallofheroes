declare namespace querystring {
  function stringify(obj: any): string;
  function parse(str: string): any;
  function escape(str: string): string;
  function unescape(str: string): string;
}
