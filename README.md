~~I haven't managed to beat this game yet...probably because I'm randomly setting the starting board position...but it's still so damn addictive.~~

Attempt at your own peril:

http://vyder.github.io/lights-out

Edit:

I'm not proud of this code. I made a fundamental mistake with dumping too much delegation in [LightsOutGame](js/lights-out-game.js) in an attempt to abstract out the view code to [main.js](js/main.js) and then realized the easiest way to create a seed for the game was to simulate an arbitrary set of moves on a blank board...which led to the creation of [LightsOutGameGenerator](js/lights-out-game-generator.js) by which time I was thoroughly sick of the whole game because it has so little replayability. So here is the final product, may it rest in piece(s).
