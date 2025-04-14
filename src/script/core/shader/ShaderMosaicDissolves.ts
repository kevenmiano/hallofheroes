import Logger from "../logger/Logger";

/**
 * 人物消散Shader
 */
export default class ShaderMosaicDissolve extends Laya.Script {
  public static vs: string = `
    attribute vec4 posuv;
    attribute vec4 attribColor;
    attribute vec4 attribFlags;
    attribute vec4 clipDir;
    attribute vec2 clipRect;
    uniform vec4 clipMatDir;
    uniform vec2 clipMatPos;
    varying vec2 cliped;
    uniform vec2 size;
    uniform vec2 clipOff;
    #ifdef WORLDMAT
        uniform mat4 mmat;
    #endif
    #ifdef MVP3D
        uniform mat4 u_MvpMatrix;
    #endif
    varying vec4 v_texcoordAlpha;
    varying vec4 v_color;
    varying float v_useTex;
    void main() {
        vec4 pos = vec4(posuv.xy,0.,1.);
        #ifdef WORLDMAT
            pos=mmat*pos;
        #endif
        vec4 pos1  =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,0.,1.0);
        #ifdef MVP3D
            gl_Position=u_MvpMatrix*pos1;
        #else
            gl_Position=pos1;
        #endif
        v_texcoordAlpha.xy = vec2(posuv.z * 2.0, posuv.w);
        v_texcoordAlpha.z = attribColor.a/255.0;
        v_color = attribColor/255.0;
        v_color.xyz*=v_color.w;
        v_useTex = attribFlags.r/255.0;
        float clipw = length(clipMatDir.xy);
        float cliph = length(clipMatDir.zw);
        vec2 clpos = clipMatPos.xy;
        #ifdef WORLDMAT
        if(clipOff[0]>0.0){
            clpos.x+=mmat[3].x;
            clpos.y+=mmat[3].y;
        }
        #endif
        vec2 clippos = pos.xy - clpos;

        if(clipw>20000. && cliph>20000.)
            cliped = vec2(0.5,0.5);
        else {
            cliped=vec2( dot(clippos,clipMatDir.xy)/clipw/clipw, dot(clippos,clipMatDir.zw)/cliph/cliph);
        }
    }`;
  //片元着色器 --- 根据噪图 过滤掉低于阈值的颜色
  public static ps: string = `
    #define SHADER_NAME DissolveEdgeFrag
    #if defined(GL_FRAGMENT_PRECISION_HIGH)
        precision highp float;
    #else
        precision mediump float;
    #endif

    varying vec4 v_texcoordAlpha;
    varying vec4 v_color;
    varying float v_useTex;
    varying vec2 cliped;

    uniform sampler2D texture;
    uniform float time;
    uniform vec4 uvRect;

    float s_ran(vec2 st){
        return fract(sin(dot(st.xy,vec2(12.9898,178.233)))*43758.5453123);
    }

    void main(){
        vec4 color;
        float uvX = (v_texcoordAlpha.x * 0.5 - uvRect.x) / uvRect.z;
        float uvY = (v_texcoordAlpha.y - uvRect.y) / uvRect.w;
        if (time >= 3.5) {
            discard;
        }
        float tX = 3.0 * uvRect.x + uvRect.z - v_texcoordAlpha.x;
        // float nX = v_texcoordAlpha.x - uvRect.x;
        if (time < 2.0) {
            color = texture2D(texture, vec2(v_texcoordAlpha.x - uvRect.x,v_texcoordAlpha.y));

            // color = texture2D(texture, vec2(tX,v_texcoordAlpha.y));
            if (tX < uvRect.x) {
                discard;
            }
             if (uvY < time * 0.35) {
                color.xyz *= 0.65;
             }
        } else {
            // float ppp = (v_texcoordAlpha.y - 0.5) / 6.0 * v_texcoordAlpha.x;
            float sran = fract(sin(dot(v_texcoordAlpha.xy,vec2(12.9898,178.233)))*43758.5453123);
            // float x = uvX + (0.19 * (time- 2.0) * 3.0) * (sran - 0.5) - time * time * 0.03;


            // float pam1 = 0.12; //越大越快, 越密
            // float x = tX * 1.0 + (0.19 * (time- 2.0) * 1.0) * (sran - 0.1) + time * time * pam1 * uvX;

            float tt = (time-2.0)*(time-2.0)/uvX/12.0;
            float x = tX + (sran * tt);
            color = texture2D(texture, vec2(x, v_texcoordAlpha.y + (sran - 0.5) * 0.005));
            if (uvY < 0.7) {
                color.xyz *= 0.75;
            }
            if (x < uvRect.x) {
                discard;
            }if (x > uvRect.x + uvRect.z) {
                discard;
            }
            // color.xyz *= sran;
            // color.xyz += 0.1;
        }
        gl_FragColor = color;
    }`;

  declare public owner: Laya.Sprite | Laya.Image;

  private shaderValue: Laya.Value2D;
  public static SHADER_MAIN_ID: number = 9998;
  private tex: Laya.Texture | Laya.Texture2D | Laya.RenderTexture;
  private offsetX: number;
  private offsetY: number;
  private width: number;
  private height: number;
  private uv: ArrayLike<number>;
  private frame: number = 0;

  private time: number;
  private uvRect: number[];
  private frameIndex: number = 0;
  private newScaleX: number = 1;

  constructor() {
    super();
    this.shaderValue = new Laya.Value2D(
      ShaderMosaicDissolve.SHADER_MAIN_ID,
      ShaderMosaicDissolve.SHADER_MAIN_ID,
    );
    this.shaderValue.shader = new Laya.Shader2X(
      ShaderMosaicDissolve.vs,
      ShaderMosaicDissolve.ps,
      ShaderMosaicDissolve.SHADER_MAIN_ID,
    );
  }

  onAwake(): void {
    if (!this.owner) {
      Logger.error("shader is not have owner");
      return;
    }
    // 设置自定义渲染
    this.owner.customRenderEnable = true;

    // 绑定自定义渲染函数
    this.owner.customRender = this.customRender.bind(this);
    if (this.owner instanceof Laya.Animation) {
      let texture = this.owner.texture;
      if (!texture) {
        if (!this.owner.frames) {
          return;
        }

        this.newScaleX = this.owner.parent.scaleX * -1;
        if (this.owner.index != undefined) {
          this.frame = this.owner.index;
        }
        let cmds = this.owner.frames[this.frame].cmds as Laya.DrawImageCmd[];
        if (cmds) {
          Logger.warn("// TODO该精灵由多个纹理渲染");
        } else {
          // 该精灵由单个纹理渲染
          let graphics = this.owner.frames[this.frame];
          texture = graphics["_one"].texture;
        }
      }
      if (texture) {
        this.width = texture.width;
        this.height = texture.height;

        this.uv = texture.uv;
        this.uvRect = texture.uvrect;
        this.shaderValue["uvRect"] = this.uvRect;
        this.tex = texture.bitmap;
        this.offsetX = texture.offsetX - this.owner.pivotX;
        this.offsetY = texture.offsetY - this.owner.pivotY;
      } else {
        Logger.error("can not find texture");
      }
    } else if (this.owner instanceof Laya.Image) {
      if (this.owner["_bitmap"] && this.owner["_bitmap"]["_source"]) {
        let texture = this.owner["_bitmap"]["_source"];
        this.width = texture.width;
        this.height = texture.height;
        this.uv = texture.uv;
        this.tex = texture.bitmap;
        this.offsetX = texture.offsetX - this.owner.pivotX;
        this.offsetY = texture.offsetY - this.owner.pivotY;
        this.owner.skin = "";
      } else {
        Logger.error("can not find texture");
      }
    } else if (this.owner instanceof Laya.Sprite) {
      let texture = this.owner.texture;
      if (!texture) {
        let cmds = this.owner.graphics.cmds as Laya.DrawImageCmd[];
        if (cmds) {
          Logger.warn("// TODO该精灵由多个纹理渲染");
        } else {
          // 该精灵由单个纹理渲染
          let graphics = this.owner.graphics;
          texture = graphics["_one"].texture;
        }
      }
      if (texture) {
        this.width = texture.width;
        this.height = texture.height;

        this.uv = texture.uv;
        this.tex = texture.bitmap;
        this.offsetX = texture.offsetX - this.owner.pivotX;
        this.offsetY = texture.offsetY - this.owner.pivotY;
        // 移除旧图片
        this.owner.texture = null;
      } else {
        Logger.error("can not find texture");
      }
    }
  }

  /** 设置时间 */
  public setFrame(value: number) {
    this.frame = value;
  }

  /** 设置时间 */
  public setTime(value: number) {
    if (this.shaderValue) {
      this.time = value;
      this.shaderValue["time"] = value;
      if (value >= 2) {
        if (this.owner && this.owner.parent) {
          this.owner.parent.scaleX = this.newScaleX;

          if (this.owner instanceof Laya.Sprite) {
            this.owner.graphics.clear();
          }
        }
      }
    }
  }

  public getTime() {
    return this.time;
  }

  onEnable(): void {
    this.time = 0;
  }

  /** 自定义渲染提交(隐藏或销毁后, 不会执行此方法) */
  public customRender(context: Laya.Context, x: number, y: number) {
    if (!context || !this.tex) return;
    context.drawTarget(
      this.tex as any,
      x + this.offsetX, // 渲染起点(距离舞台偏移---图片坐标x + 图片在纹理中的偏移)
      y + this.offsetY, // 渲染起点(距离舞台偏移)
      this.width * 2, // 渲染宽度(图片宽度)
      this.height, // 渲染高度
      null,
      this.shaderValue, // 使用的shader
      this.uv, // 纹理uv
    );
  }
}
