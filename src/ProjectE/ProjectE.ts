import WebGLCanvas from '../Utility/WebGL/WebglCanvas';
import WebglUtility from '../Utility/WebGL/WebglUtility';
import {ProjectEConfig} from './ProjectEType';
import REGL, {Regl} from 'regl';
import {CreateREGLCommandObj, ExecuteREGLCommand} from './ProjectERegl';
import CanvasInputHandler from '../Utility/Input/CanvasInputHandler';
import EventSystem from '../Utility/EventSystem';

class ColorWheel extends WebGLCanvas{
    webglUtility : WebglUtility;
    reglDrawCommand : REGL.DrawCommand;
    reglFrame : REGL.Cancellable;

    inputHandler : CanvasInputHandler;
    eventSystem : EventSystem;

    private previousTimeStamp : number = 0;
    public time : number;

    constructor( config: ProjectEConfig) {
        super(config.webgl_dom);
        this.webglUtility = new WebglUtility();
        this.eventSystem = new EventSystem();
        
        this.inputHandler = new CanvasInputHandler(this._webglDom, this.eventSystem);

        this.InitProcess(config.vertex_path, config.frag_path);
    }

    async InitProcess(vertexFilePath : string, fragmentFilePath : string) {
        await this.SetupWebglPipeline(vertexFilePath, fragmentFilePath);

        //Draw the image in first frame
        this.DrawREGLCavnas();

        window.requestAnimationFrame(this.PerformGameLoop.bind(this));
    }

    async SetupWebglPipeline(vertexFilePath : string, fragmentFilePath : string) {
        this._reglContext  = await this.CreatREGLCanvas (this._webglDom);        
        let glslSetting = await this.webglUtility.PrepareREGLShader(vertexFilePath, fragmentFilePath);
        let planeVertex = this.webglUtility.GetPlaneVertex();

        this.reglDrawCommand  = await CreateREGLCommandObj(
            this._reglContext, 
            glslSetting.vertex_shader, 
            glslSetting.fragment_shader,
            planeVertex.a_position, planeVertex.a_uv, planeVertex.count);
    }

    DrawREGLCavnas() {
        this._reglContext.clear({
            color: [0, 0, 0, 1],
            depth: 1
        });

        // ExecuteREGLCommand(this._reglContext, this.reglDrawCommand, 
        // {
        //     time : 0,
        //     mainColor: [0, 0, 0, 1]
        // });
    }

    private PerformGameLoop(timeStamp : number) {
        let ms =  (timeStamp - this.previousTimeStamp) / 1000;
        this.time = (timeStamp) / 1000;
        this.previousTimeStamp = timeStamp;

        // if (this.UpdateLoopCallback != null)
        //     this.UpdateLoopCallback(this.time);

        this.DrawREGLCavnas();

        window.requestAnimationFrame(this.PerformGameLoop.bind(this));
    }
}

export default ColorWheel;