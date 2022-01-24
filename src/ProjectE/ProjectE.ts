import WebGLCanvas from '../Utility/WebGL/WebglCanvas';
import WebglUtility from '../Utility/WebGL/WebglUtility';
import {ProjectEConfig} from './ProjectEType';
import REGL, {Regl} from 'regl';
import {CreateREGLCommandObj, ExecuteREGLCommand} from './ProjectERegl';
import CanvasInputHandler from '../Utility/Input/CanvasInputHandler';
import EventSystem from '../Utility/EventSystem';

import { MaskHighLight } from './Effect/MaskHighlight';
import { PlaneVertex } from '../Utility/UniversalType';

class ProjectE extends WebGLCanvas{
    webglUtility : WebglUtility;
    reglDrawCommand : REGL.DrawCommand;
    reglFrame : REGL.Cancellable;

    inputHandler : CanvasInputHandler;
    eventSystem : EventSystem;
    maskHighlight : MaskHighLight;
    private previousTimeStamp : number = 0;
    public time : number;

    private _currentFrontTex : REGL.Texture;
    private _currentHighlightTex : REGL.Texture;
    private _planeVertex : PlaneVertex;

    constructor( config: ProjectEConfig) {
        super(config.webgl_dom);
        this.webglUtility = new WebglUtility();
        this.eventSystem = new EventSystem();
        this.maskHighlight = new MaskHighLight(this._webglDom, config);
        
        this.inputHandler = new CanvasInputHandler(this._webglDom, this.eventSystem);

        this.InitProcess(config.vertex_path, config.frag_path);
    }

    async InitProcess(vertexFilePath : string, fragmentFilePath : string) {
        await this.maskHighlight.CacheMaskTexture();
        await this.SetupWebglPipeline(vertexFilePath, fragmentFilePath);

        //Draw the image in first frame
        this.DrawREGLCavnas();
    }

    async SetupWebglPipeline(vertexFilePath : string, fragmentFilePath : string) {
        this._reglContext  = await this.CreatREGLCanvas (this._webglDom);        
        let glslSetting = await this.webglUtility.PrepareREGLShader(vertexFilePath, fragmentFilePath);
        this._planeVertex = this.webglUtility.GetPlaneVertex();

        let textureSet = this.maskHighlight.GetCurrentPairTexture();
        this._currentFrontTex = this._reglContext.texture({data:textureSet[0], flipY: true});
        this._currentHighlightTex = this._reglContext.texture({data:textureSet[1], flipY: true});
        this.UpdatePlaneVertex();

        this.reglDrawCommand  = await CreateREGLCommandObj(
            this._reglContext,
            glslSetting.vertex_shader, 
            glslSetting.fragment_shader,
            this._currentFrontTex, this._currentHighlightTex, this._planeVertex.a_uv, this._planeVertex.count);
    }

    DrawREGLCavnas() {
        this._reglContext.frame(({time}) => {


            let clipPos = this.ScreenPositionToClipSpace(this.maskHighlight.inputInteractionType.mouse_screenpos_x, this.maskHighlight.inputInteractionType.mouse_screenpos_y);

            // clear contents of the drawing buffer
            this._reglContext.clear({
                color: [0, 0, 0, 0],
                depth: 1
            })
            
            ExecuteREGLCommand(this._reglContext, this.reglDrawCommand, 
            {
                position : this._planeVertex.a_position,
                time : 0,
                mainColor: [0, 0, 0, 1],
                mousePos : [clipPos.x, clipPos.y],
                isMouseEnable: 1,
            });
        });
    }

    private UpdatePlaneVertex() {
        if (this._currentHighlightTex == null) return;
        
        let currentAspectRatio = this._webglDom.width / this._webglDom.height;
        let originalAspectRatio = this._currentHighlightTex.width / this._currentHighlightTex.height;
        let aspectRatio = originalAspectRatio / currentAspectRatio;

        this._planeVertex = this.webglUtility.ApplyAspectRatioToPlane(this.webglUtility.GetPlaneVertex(), aspectRatio);
    }

    protected AutoSetCanvasSize() {
        super.AutoSetCanvasSize();
        this.UpdatePlaneVertex();
    }
}

export default ProjectE;