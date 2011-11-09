var container,
stats;
var camera,
scene,
projector,
renderer;

var squareArray = [];
var forwardArray = [];
var backArray = [];

var mouse = {
    x: 0,
    y: 0
},
INTERSECTED,
INTERSECTED2;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 300, 500);

    scene = new THREE.Scene();

    var light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set( - 1, -1, -1).normalize();
    scene.add(light);

    var geometry = new THREE.CubeGeometry(30, 30, 30);

    for (var i = 0; i < 6; i++) {

        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('textures/timeline.jpg')
        }));

        object.position.x = 170 * (i % 3) - 170;
        object.position.y = -85 + Math.round((i - 1) / 3) * 170;
        object.position.z = 100;
        object.scale.x = 4;
        object.scale.y = 4;
        object.scale.z = 4;
        scene.add(object);
        squareArray.push(object);
        

    }

    projector = new THREE.Projector();
    renderer = new THREE.WebGLRenderer();
    renderer.sortObjects = false;
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

var radius = 100;
var theta = 0;

function render() {

    theta += 0.2;

    camera.position.x = mouse.x * 400;
    camera.position.y = mouse.y * 300;

    camera.lookAt(scene.position);

    // find intersections
    camera.update();

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

    var intersects = ray.intersectScene(scene);
    
    
    var backCubes = function(target)    
    {
        var targetParam = target;
        $.each(squareArray, function(index)
        {
              
              if(targetParam === undefined) target = $(this)[0];
              var forIndex = forwardArray.indexOf(target);
              var backIndex = backArray.indexOf(target);
              
              if(forIndex !== -1 && backIndex === -1) 
              {

                    backArray.push(target);
                    forwardArray.splice(forIndex, 1);
                    
                      var positionT2 = {
                          x: target.rotation.x
                      };
                      var targetT2 = {
                          x: 0
                      };
                      var tween2 = new TWEEN.Tween(positionT2).to(targetT2, 1200).easing(TWEEN.Easing.Elastic.EaseOut);
                      setTimeout(function()
                      {
                          var backIndex2 = backArray.indexOf(target);
                          backArray.splice(backIndex2, 1);
                      }, 1200);
                      tween2.onUpdate(function() {
                        
                          $.each(backArray, function(index)
                          {
                                $(this)[0].rotation.x = positionT2.x;
                          });
                      });
                      tween2.start();

                }
          });        
    };
    
    
    if (intersects.length > 0)
    {
        $.each(squareArray, function(index)
        {
            if($(this)[0] === intersects[0].object)
            {
                if(forwardArray.indexOf($(this)[0]) === -1 ) 
                {
                    forwardArray.push($(this)[0]);

                    var positionT = {
                        x: $(this)[0].rotation.x
                    };
                    var targetT = {
                        x: 90 * Math.PI / 180
                    };
                    var tween = new TWEEN.Tween(positionT).to(targetT, 800).easing(TWEEN.Easing.Elastic.EaseOut);

                    tween.onUpdate(function() 
                    {
                        $.each(forwardArray, function(index)
                        {
                            $(this)[0].rotation.x = positionT.x;
                        });
                    });

                    tween.start();
                }

            }
            else backCubes($(this)[0]);
        });
    }
    else backCubes();
    

    TWEEN.update();
    renderer.render(scene, camera);

}
