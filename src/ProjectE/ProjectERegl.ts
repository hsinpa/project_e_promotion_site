import REGL, {Regl} from 'regl';
import {VertexAttributeType} from './ProjectEType';

export interface CustomReglPropType {
    time : number,
    mainColor : number[],
}

export function ExecuteREGLCommand(regl : Regl, drawCommand : REGL.DrawCommand, vertexAttrType : VertexAttributeType) {    
    drawCommand({
        time : (vertexAttrType.time),
        mainColor : vertexAttrType.mainColor,
    });
}

export function CreateREGLCommandObj(regl : Regl, vertex : string, fragment : string,
    a_position: number[][], a_uv : number[][], vertex_count: number
    ) {
    return regl({
        frag: fragment,
        vert: vertex,

        attributes: {
            a_position: a_position,
            a_uv :  a_uv,
        },

        uniforms: {
            time: regl.prop<CustomReglPropType, "time">("time"),
            u_mainColor: regl.prop<CustomReglPropType, "mainColor">("mainColor"),
        },

        count: vertex_count
    });
}