attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
attribute vec4 av4VertexFarbe;
varying vec4 vColor;

varying vec2 vTextureCoord;
varying vec3 vLighting;

void main()
{
	vec4 position = vec4(aVertexPosition, 1.0);
	gl_Position= uProjectionMatrix * uModelViewMatrix * position;

	// Beleuchtungseffekt anwenden
    vec3 ambientLight = vec3(0.6, 0.6, 0.6);
    vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
    vec3 directionalVector = vec3(0.85, 0.8, 0.75);

    vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);

	vColor = vec4(aVertexColor,1.0);
}