$(document).ready(function(){

  var world = Physics();
  // Renderer
  var  viewWidth = 640;
  var viewHeight = 480;
  var renderer = Physics.renderer('canvas',{
    el: 'dropperSpace'
    ,width: viewWidth
    ,height: viewHeight
    ,meta: false		// setting it to "true" will display FPS
  });
  world.add(renderer);

  world.on("step", function() {
    world.render();
  });

  // Behaviors
  var gravity = Physics.behavior('constant-acceleration');
  var edgeBounce = Physics.behavior('edge-collision-detection', {
    aabb: Physics.aabb(0, 0, viewWidth, viewHeight)
    , restitution: 0.3
  });
  var bodyBounce = [ Physics.behavior('body-impulse-response')
                    ,Physics.behavior('body-collision-detection')
                    ,Physics.behavior('sweep-prune')];

  world.add(gravity);
  world.add(edgeBounce);
  world.add(bodyBounce);

  var ball = Physics.body('circle', {
    x: 5
    ,y: 0
    ,radius: 20
    ,restitution: 1.9
  });
  world.add(ball);

  // Handle click events
  // $('#dropperSpace').click(function(e){
  //   // checking canvas coordinates for the mouse click
  //   var offset = $(this).offset();
  //   var px = e.pageX - offset.left;
  //   var py = e.pageY - offset.top;
  //
  //   // this is the way physicsjs handles 2d vectors, similar at Box2D's b2Vec
  //   var mousePos = Physics.vector();
  //   mousePos.set(px,py);
  //   // finding a body under mouse position
  //
  //   var body = world.findOne({
  //     $at: mousePos
  //   })
  //
  //   // there isn't any body under mouse position, going to create a new box
  //   if(!body){
  //     world.add(Physics.body('circle', {
  //        x: px
  //       ,y: py
  //       ,radius: 20
  //       ,restitution: 1.9
  //     }));
  //   } else {
  //     // If there is a body under the mouse, remove it
  //     world.removeBody(body);
  //   }
  // });

  // handling timestep
  // Physics.util.ticker.on(function(time,dt){
  //   world.step(time);
  // });
  //
  // Physics.util.ticker.start();
});
