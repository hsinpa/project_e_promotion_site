import {MaskTextureType, ProjectEConfig, InputInteractionType} from '../ProjectEType';
import {IsMobileDevice, GetImagePromise} from '../../Utility/UtilityMethod';
import InputHandler, {InputState} from '../../Utility/Input/CanvasInputHandler';
import EventSystem from '../../Utility/EventSystem';
import {CustomEventTypes, IntVector2 } from '../../Utility/UniversalType';

export class MaskHighLight {

    _front_textures : HTMLImageElement[];
    _highlight_textures : HTMLImageElement[];
    _currentIndex = 0;
    _isMobileDevice = false;
    _config: ProjectEConfig;
    _input : InputHandler;
    _eventSystem : EventSystem;
    
    inputInteractionType : InputInteractionType;
    maskTexType : MaskTextureType;

    constructor(webgl:HTMLCanvasElement, config: ProjectEConfig) {
        this._config = config;
        this._eventSystem = new EventSystem();

        this._input = new InputHandler(webgl, this._eventSystem);
        this._eventSystem.ListenToEvent(CustomEventTypes.MouseMoveEvent, this.OnMouseMoveEvent.bind(this));
        //this._eventSystem.ListenToEvent(CustomEventTypes.MouseDragEvent, this.OnMouseMoveEvent.bind(this));

        this._isMobileDevice = IsMobileDevice();

        this.inputInteractionType = {
            mouse_screenpos_x :0,
            mouse_screenpos_y : 0,
            input_enable: (!this._isMobileDevice)
        }

        console.log("Is Mobile Device "+ this._isMobileDevice);
    }

    public async CacheMaskTexture() {
        this.maskTexType = (this._isMobileDevice) ? this._config.mobile_textures : this._config.desktop_textures;

        this._front_textures = [];
        this._highlight_textures = [];

        for (let i = 0; i < this.maskTexType.count; i++) {
            this._front_textures.push(await GetImagePromise(this.maskTexType.front_textures[i]));
            this._highlight_textures.push(await GetImagePromise(this.maskTexType.highlight_textures[i])); 
        }
    }

    public GetCurrentPairTexture() : [HTMLImageElement, HTMLImageElement]{
        return [this._front_textures[this._currentIndex], this._highlight_textures[this._currentIndex] ];
    }

    public GetNextPairTexture() : [HTMLImageElement, HTMLImageElement] {
        this._currentIndex = (this._currentIndex + 1) % this.maskTexType.count;
        return [this._front_textures[this._currentIndex], this._highlight_textures[this._currentIndex] ];
    }

    //#region  Input Event
    private OnMouseMoveEvent(e: any) {
        this.inputInteractionType.mouse_screenpos_x = e.mousePosition.x;
        this.inputInteractionType.mouse_screenpos_y = e.mousePosition.y;
    }

    //#endregion
}