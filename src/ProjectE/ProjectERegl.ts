import REGL, {Regl} from 'regl';
import {VertexAttributeType} from './ProjectEType';

export interface CustomReglPropType {
    position : number[][],
    time : number,
    mainColor : number[],
    mousePos : number[],
    isMouseEnable : number
}

export function ExecuteREGLCommand(regl : Regl, drawCommand : REGL.DrawCommand, vertexAttrType : CustomReglPropType) {    
    drawCommand({
        position : vertexAttrType.position,
        time : (vertexAttrType.time),
        mainColor : vertexAttrType.mainColor,
        mousePos : (vertexAttrType.mousePos),
        isMouseEnable : vertexAttrType.isMouseEnable,
    });
}

export function CreateREGLCommandObj(regl : Regl, vertex : string, fragment : string, 
    frontTex : REGL.Texture, highlightTex: REGL.Texture, 
    a_uv : number[][], vertex_count: number
    ) {
    return regl({
        frag: fragment,
        vert: vertex,

        attributes: {
            a_position: regl.prop<CustomReglPropType, "position">("position"),
            a_uv :  a_uv,
        },

        uniforms: {
            u_front_tex : frontTex,
            u_highlight_tex : highlightTex,
            u_time: regl.prop<CustomReglPropType, "time">("time"),
            u_mainColor: regl.prop<CustomReglPropType, "mainColor">("mainColor"),
            u_mousePos: regl.prop<CustomReglPropType, "mousePos">("mousePos"),
            u_isMouseEnable: regl.prop<CustomReglPropType, "isMouseEnable">("isMouseEnable"),
        },

        count: vertex_count
    });
}