var gl = new kelios("canv",{
    anisotropic: 16,
    fxaa: true,
    /*width:320,
    height:240,*/
    clearColor: [0.1, 0.6, 0.6]
});
/*var draw = SVG('ui').size(gl.width, gl.height)
var link = draw.link("http://yandex.ru/");
var rect= link.rect(100,100);*/
gl.loadData([
  "textures/skybox/right.jpg",
  "textures/skybox/left.jpg",
  "textures/skybox/top.jpg",
  "textures/skybox/bottom.jpg",
  "textures/skybox/back.jpg",
  "textures/skybox/front.jpg",	 
 // "textures/skybox/new.jpg",

  "textures/mustang/Tex_0038_2.png",
  "textures/mustang/Tex_0040_2.png",
  "textures/mustang/Tex_0040_4.png",
  "textures/mustang/Tex_0044_2.png",
  "textures/mustang/Tex_0090_2.png",
  "textures/mustang/Tex_0091_2.png"
], ["xp", "xm", "yp", "ym", "zp", "zm",// "sky1",
"mustang_0038_2", "mustang_0040_2", "mustang_0040_4", "mustang_0044_2", "mustang_0090_2", "mustang_0091_2"
], "image", function (num, src) {
}, function() {
	var camera = gl.createCamera([-0.17971608176132303, 2.564654457332847, 5.258062451354932], [-75, 0, 0], {
        type: "perspective",
        aspect: 0,
        angle: 30,
        nearPlane: 0.1,
        farPlane: 100
    });
    var scene = gl.createScene({
        shadowSetting: {
            type: gl.BLURED_VSM,
            blurScale: 3,
            bitsPerChanel: 2,
            splitForDirectionLight: 2,
            encodeTexture: true,
            IOQWAIIS: false,
            devideTexture: false //for Blured VSM
        },
        sceneParam: {
            autoResize: true,
            width: gl.width,
            height: gl.height
        },
        OIT: {
            enable: true,
            splitCount: 2
        }
    });
    scene.addCamera("testCamera1", camera);
    var size = 1024;
    var bias = 0.015;
    
    var light = gl.createLight("direction", {
    	position: [0, 0, 0],
    	direction: [45, 0, 60],
    	color: [1, 1, 1],
    	emission: 0.3,
    	enable: true
    }, {
    	enable: true,
    	size: size,
    	bias: bias,
    	normalBias: 0.01,
    	camera: camera,
    	distantion: 20,
    	koef: 0.4,
    	ds: 0.8
    });
    //scene.addLight(light);
    var light2 = gl.createLight("direction", {
    	position: [0, 0, 0],
    	direction: [0, 0, 45],
    	color: [1, 1, 1],
    	emission: 0.5,
    	enable: true
    }, {
    	enable: true,
    	size: size,
    	bias: bias,
    	normalBias: 0.01,
    	camera: camera,
    	distantion: 20,
    	koef: 0.3,
    	ds: 0.8
    });
    scene.addLight(light2);
    //light2.color = [0.5, 0.8, 0.9, 1];
    var p = []
      , elementName = [];
    var stats = new Stats();
    stats.setMode(0);
    // 0: fps, 1: ms, 2: mb
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    var m0 = gl.createMaterial({
      diffuse:{
        color:[1,1,1],
        softness:[0.4]
      }
    });
    var plane = gl.createElement({
        vertex: gl.plane.vertex,
        index: gl.plane.index,
        normal: gl.plane.normal,
        uv: gl.plane.uv
    });
    scene.addMesh("plane1", plane, {
        size: [10, 10, 10],
        position: [0, 0, 0],
        rotate: [0, 0, 0]
    }, m0);	 
    p.push(m0);
    var aa1 = [0.2, 0.5, 0.5];
	//var aa1=[0,0,0];
    var skybox1 = gl.createSky({
        type: 0,
        xp: "xp",
        xm: "xm",
        yp: "yp",
        ym: "ym",
        zp: "zp",
        zm: "zm",
        /*type:1,
        texture:"sky1",*/
        s: 0.8,
        levels: aa1
    }, skyboxLoaded, true);
    function skyboxLoaded(textureSkyBox) {
        setTimeout(function() {
            nextLoad(textureSkyBox)
        }, 100);
    }
    var mouseIntensity = 0.15,
        mouseYinverse = -1 ,
    	mouseXinverse = -1;
    scene.events.mouse.mouseDrag.push(function(a) {
    	camera.rotate(a.deltaY * mouseYinverse * mouseIntensity,mouseXinverse* a.deltaX * mouseIntensity, 0);
        camera.rebuild();
        scene._sky.rebuild();
        scene.updateDirectionShadowCamera();
    });
    var cameraSpeedKeyboard = 0.1;
    function freeCameraForward(camera) {
        var oldPos = gl.cloneArray(camera.position);
        var oldDir = gl.cloneArray(camera.direction);
        camera.position = gl.v3.continueVector(oldPos, oldDir, cameraSpeedKeyboard);
        var newP_s = gl.v3.minus(camera.position, oldPos);
        camera.leftPoint = gl.v3.sum(camera.leftPoint, newP_s);
        camera.direction = gl.v3.continueVector(oldDir, oldPos, -cameraSpeedKeyboard);
        camera.generateCameraMatrix();
        camera.rebuild();
        scene.updateDirectionShadowCamera();
    }
    function freeCameraBack(camera) {
        var oldPos = gl.cloneArray(camera.position);
        var oldDir = gl.cloneArray(camera.direction);
        camera.position = gl.v3.continueVector(oldPos, oldDir, -cameraSpeedKeyboard);
        var newP_s = gl.v3.minus(camera.position, oldPos);
        camera.leftPoint = gl.v3.sum(camera.leftPoint, newP_s);
        camera.direction = gl.v3.continueVector(oldDir, oldPos, cameraSpeedKeyboard);
        camera.generateCameraMatrix();
        camera.rebuild();
        scene.updateDirectionShadowCamera();
    }
    function freeCameraLeft(camera) {
        var oldPos = gl.cloneArray(camera.position);
        var oldDir = gl.cloneArray(camera.direction);
        var oldLeft = gl.cloneArray(camera.leftPoint);
        camera.position = gl.v3.continueVector(oldPos, oldLeft, cameraSpeedKeyboard);
        camera.leftPoint = gl.v3.continueVector(oldLeft, oldPos, -cameraSpeedKeyboard);
        var newP_s = gl.v3.minus(camera.position, oldPos);
        camera.direction = gl.v3.sum(camera.direction, newP_s);
        camera.generateCameraMatrix();
        camera.rebuild();
        scene.updateDirectionShadowCamera();
    }
    function freeCameraRight(camera) {
        var oldPos = gl.cloneArray(camera.position);
        var oldDir = gl.cloneArray(camera.direction);
        var oldLeft = gl.cloneArray(camera.leftPoint);
        camera.position = gl.v3.continueVector(oldPos, oldLeft, -cameraSpeedKeyboard);
        camera.leftPoint = gl.v3.continueVector(oldLeft, oldPos, cameraSpeedKeyboard);
        var newP_s = gl.v3.minus(camera.position, oldPos);
        camera.direction = gl.v3.sum(camera.direction, newP_s);
        camera.generateCameraMatrix();
        camera.rebuild();
        scene.updateDirectionShadowCamera();
    }
    var trF, trB, trL, trR;
    scene.events.keyboard.keyUp.push(function(a) {
        if (a == "W") {
            clearInterval(trF);
            //clearInterval(trB);
        }
        if (a == "S") {
            //clearInterval(trF);
            clearInterval(trB);
        }
        if (a == "A") {
            //clearInterval(trF);
            clearInterval(trL);
        }
        if (a == "D") {
            //clearInterval(trF);
            clearInterval(trR);
        }
    });
    scene.events.keyboard.keyDown.push(function(a) {
        if (a == "W") {
            clearInterval(trF);
            clearInterval(trB);
            /*clearInterval(trL); clearInterval(trR);*/
            trF = setInterval(function() {
                freeCameraForward(camera)
            }, 1000 / 60);
        }
        if (a == "S") {
            clearInterval(trF);
            clearInterval(trB);
            /*clearInterval(trL);
    clearInterval(trR);*/
            trB = setInterval(function() {
                freeCameraBack(camera)
            }, 1000 / 60);
        }
        if (a == "A") {
            /*clearInterval(trF);    clearInterval(trB);*/
            clearInterval(trL);
            clearInterval(trR);
            trL = setInterval(function() {
                freeCameraLeft(camera)
            }, 1000 / 60);
        }
        if (a == "D") {
            /*clearInterval(trF);
    clearInterval(trB);*/
            clearInterval(trL);
            clearInterval(trR);
            trR = setInterval(function() {
                freeCameraRight(camera)
            }, 1000 / 60);
        }
    });
    function nextLoad(textureSkyBox) {
    	Collada.load("mustang1.dae", function(data) {
            var testGroup = gl.createGroup("testGroup");
            //console.log(data);
            var materials = [gl.createMaterial({
                //1
                reflection: {
                    color: [1, 1,1],
                    glossy: 1,
                    intensity: 0.95,
					fresnel:0.8
                }
            }), gl.createMaterial({
                //2
                diffuse: {
                    color: [1, 1, 1],
                    aldebo: "mustang_0044_2"
                }
            }), gl.createMaterial({
                //3
                diffuse: {
                    color: [2, 2, 2],
                }
            }), gl.createMaterial({
                //4
                diffuse: {
                    color: [0.044, 0.044, 0.044],
                }
            }), gl.createMaterial({
                //5
                reflection: {
                    color: [1, 1, 1],
                    glossy: 1,
                    intensity: 1
                },
                transparent: {//стекло-glass
                    alpha:0.4
                }
            }), gl.createMaterial({
                //6
                diffuse: {
                    color: [1, 1, 1],
                    aldebo: "mustang_0090_2"
                }
            }), gl.createMaterial({
                //7
                reflection: {
                    color: [0.8, 0.08, 0.052],
                    glossy: 0.95,
                    intensity: 0.8
                }
            }), gl.createMaterial({
                //8
                diffuse: {
                    color: [0.34, 0.34, 0.34],
                }
            }), gl.createMaterial({
                //9
                reflection: {
                    color: [0.8, 0.8, 0.8],
                    glossy: 0.3,
                    intensity: 0.8
                }
            }), gl.createMaterial({
                //10
                diffuse: {
                    color: [0.2, 0.2, 0.2],
                    aldebo: "mustang_0038_2"
                }
            }), gl.createMaterial({
                //11
                diffuse: {
                    color: [1, 1, 1],
                    aldebo: "mustang_0040_2"
                },
                normalMap: {
                    texture: "mustang_0040_4",
                    koef: 1,
                    flip: [1, 1, 1]
                }
            }), gl.createMaterial({
                //12
                reflection: {
                    color: [0.8, 0.8, 0.8],
                    glossy: 0.6,
                    intensity: 0.7
                }
            }), gl.createMaterial({
                //13
                diffuse: {
                    color: [0.085, 0.085, 0.085],
                }
            }), gl.createMaterial({
                //14
                diffuse: {
                    color: [0.58, 0.58, 0.58],
                }
            }), gl.createMaterial({
                //15
                diffuse: {
                    color: [0.58, 0.58, 0.58],
                }
            }), gl.createMaterial({
                //16
                diffuse: {
                    color: [1, 1, 1],
                    aldebo: "mustang_0091_2"
                }
            }), gl.createMaterial({
                //17
                diffuse: {
                    color: [0.58, 0.58, 0.58],
                }
            }), gl.createMaterial({
                //18
                reflection: {
                    color: [0.8, 0.8, 0.8],
                    glossy: 0.95,
                    intensity: 1
                }
            })];
            materials.forEach(function (m) { p.push(m) });
           // p.push(mat);

            var mats = [[1, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], //1
            [10], //2
            [11, 72], //3
            [12], //4
            [13, 9, 80, 81, 82, 83, 84, 85, 86, 87, 88, 79], //5
            [14, 89], //6
            [15, 94], //7
            [2, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], //8
            [3, 4, 5, 6], //9
            [48, 49, 50, 51], //10
            [52, 53, 54, 55, 7], //11
            [56, 57, 58, 59, 60, 8], //12
            [61, 62, 63, 9], //13
            [64, 65, 66, 67], //14
            [68, 69, 70, 71], //15
            [73, 74, 75, 76], //16
            [77, 78], //17
            [90, 91, 92, 93], //18
            ];
            data.root.children.forEach(function(ch) {
                //if(ch.id=="Camera")return;
                var elt = data.meshes[ch.mesh];
                var el = gl.createElement({
                    vertex: elt.vertices,
                    index: elt.triangles,
                    normal: elt.normals,
                    uv: elt.coords
                }, []);
                el.setMatrix(ch.model);
                var mat = null ;
                var id = ch.id.slice(1);
                //if(id!=28)return;
                //console.warn(id);
                mats.forEach(function(a, n) {
                    a.forEach(function(m) {
                        //console.log(n)
                        if (m == id) {
                            mat = materials[n];
                        }
                    });
                });
                //console.log(m0)
                //console.log(mat)
                scene.addMesh(ch.name, el, {
                    rotate: [0, 0, 0]
                }, mat, "testGroup");
                //scene.rotateMesh(ch.name,[-90,0,0]);
                //console.log(ch);
            });
            //testGroup.rotate(scene,[-90,0,0]);
            testGroup.translate(scene, [0, 0.65, 0]);
            //console.info(gl);
            scene.setSky(textureSkyBox);
            gl.assembly(scene, p);
            document.getElementById("loadd").innerHTML = "";
            function anim() {
                stats.begin();
                scene.draw();
                stats.end();
                requestAnimationFrame(anim);
            }
            anim();
            //setTimeout(anim,200);
        });
    	/*var el = gl.createElement({
        vertex: gl.cube.vertex,
        index: gl.cube.index,
        normal: gl.cube.normal,
        uv: gl.cube.uv
      }, []);
      gl.m4.translateY(el.Matrix,3);
      //gl.m4.rotateZ(el.Matrix,30);
      scene.addMesh("cube1", el, {position:[0,0,0]}, m0);
      scene.setSky(textureSkyBox);
      gl.assembly(scene, p);
      function anim() {
          stats.begin();
          scene.draw();
          stats.end();
          requestAnimationFrame(anim);
      }
      anim(); 
	  
    	/*var m1 = gl.createMaterial({
    		reflection: {
    			color: [1, 1, 1],
    			glossy: 0.7,
    			glossyMap: "gg",
    			specularMap: "ss",
    			intensity: 1
    		}
    	});
    	var el = gl.createElement({
    		vertex: gl.sphere.vertex,
    		index: gl.sphere.index,
    		normal: gl.sphere.normal,
    		uv: gl.sphere.uv
    	}, []);
    	p.push(m1);
    	scene.addMesh("cube1", el, { position: [0, 1, 0] }, m1);
    	scene.addMesh("cube2", el, { position: [3, 1, 0] }, m1);
    	scene.setSky(textureSkyBox);

    	gl.assembly(scene, p);
      function anim() {
      	stats.begin();
      	scene.draw();
      	stats.end();
      	requestAnimationFrame(anim);
      }
      anim();  */
    }
});
