precision mediump float;
varying vec4 vColor;
uniform vec4 uniColor;

varying vec2 vTextureCoord;
varying vec3 vLighting;

uniform sampler2D uSampler;

void main()
{
	gl_FragColor = vColor;
	gl_FragColor = uniColor;

	vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    //gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);

}