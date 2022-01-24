export interface ProjectEConfig {
    mouse_cursor : string,
    mask_radius : number,

    webgl_dom : string,
    vertex_path : string,
    frag_path : string,

    desktop_textures: MaskTextureType
    mobile_textures: MaskTextureType
}

export interface VertexAttributeType {
    time : number,// Vector2    
    mainColor : number[],
}

export interface MaskTextureType {
    front_textures : string[],
    highlight_textures: string[],
    count : number
}