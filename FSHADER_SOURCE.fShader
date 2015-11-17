precision mediump float;
varying vec4 vColor;
varying vec3 vLighting;

uniform sampler2D uSampler;

void main()
{
//	gl_FragColor = vColor;
	gl_FragColor = vec4(vLighting,1.0)*vColor;

	//vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    //gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);

}