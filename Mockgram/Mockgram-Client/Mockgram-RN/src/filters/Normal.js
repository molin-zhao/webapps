import { Shaders, Node } from 'gl-react'
import React from 'react'

const shaders = Shaders.create({
    Normal: {
        frag: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D inputImageTexture;
      void main () {
        vec3 texel = texture2D(inputImageTexture, uv).rgb;
        gl_FragColor = vec4(texel, 1.0);
      }`
    }
});

export default class Normal extends React.Component {

    renderNode = () => {
        const { on, children: inputImageTexture } = this.props;
        if (!on) return this.props.children;
        return (
            <Node
                shader={shaders.Normal}
                uniforms={{
                    inputImageTexture
                }}
            />
        );
    }
    render() {
        return (
            <this.renderNode />
        );
    }
}
