var gg = {

AttMeter: function() {

	this.tickRadius = 50;
	this.scale = 2;

	this.create = function(ggCenter) {
		if (!ggCenter) {
			var ggCenter = view.center;
		}

		// FRAME
		var ggFrame = new Path.Circle(ggCenter,60);
		ggFrame.fillColor = 'gray';
		ggFrame.strokeColor = 'black';
		ggFrame.strokeWidth = 0.7*this.scale;
		var ggGroup = new Group([ggFrame]);	

		// BACK
		// MASK
		var ggMask = new Path.Circle(ggCenter,56.5);
		ggMask.fillColor = 'gray';
		var ggHorizonGroup = new Group([ggMask]);

		// BACK HORIZON
		var ggBack = new Path.Circle(ggCenter,56);
		ggBack.fillColor = 'white';
		ggBack.strokeColor = 'black';
		ggBack.strokeWidth = 0.5*this.scale;
		ggHorizonGroup.addChild(ggBack);


		var hOffset = new Point(0,75);
		var skyy = new Path.Rectangle(ggCenter.subtract(hOffset.subtract(75)),ggCenter.subtract(hOffset.add(75)));
		var skyyBounds = skyy.bounds;
		var skyyGrad = new GradientColor(new Gradient(['red','green']),skyyBounds.topCenter,skyyBounds.bottomCenter);
		skyy.fillColor = skyyGrad;
		skyy.opacity = 0.2;

		var hLine = new Path.Line(ggCenter.subtract([75,0]),ggCenter.add([75,0]));
		hLine.strokeColor = 'gray';
		hLine.strokeWidth = this.scale/3;

		var groundd = new Path.Rectangle(ggCenter.add(hOffset.subtract(75)),ggCenter.add(hOffset.add(75)));
		var grounddBounds = groundd.bounds;
		var grounddGrad = new GradientColor(new Gradient(['black','brown']),grounddBounds.topCenter,grounddBounds.bottomCenter);
		groundd.fillColor = grounddGrad;
		groundd.opacity = 0.25;

		var ggHorizonG = new Group([skyy,hLine,groundd]);
		var pitch = 0;

		ggHorizonGroup.addChild(ggHorizonG);

		ggHorizonGroup.clipped = true;
		ggHorizonGroup.opacity = 0.99;

		ggGroup.addChild(ggHorizonGroup);

		// TEXT
		var ggText2 = new PointText(ggCenter.add([0,25]));
		ggText2.fillcolor = 'black';
		ggText2.content = 'ATTITUDE';
		ggText2.paragraphStyle.justification = 'center';
		ggText2.characterStyle = {fontSize: 7};
		ggGroup.addChild(ggText2);

		// ROLL TICKS
		var tickStyle = {
			fillColor: 'black',
			strokeColor: 'black',
			strokeWidth: 0.5*this.scale
		};
		for (i = 180; i <= 360; i += 10) {
			var tickOutside = new Point(this.tickRadius,0);
			var tickInside = new Point(this.tickRadius-10,0);
			tickOutside.angle = i;
			tickInside.angle = i;
			var tick = new Path.Line(ggCenter.add(tickInside),ggCenter.add(tickOutside));
			tick.style = tickStyle;
			ggGroup.addChild(tick);
		}

		// ROLL PLANE
		var ggNeedleStyle = {
			fillColor: 'red',
			strokeColor: 'red',
			strokeWidth: 2*this.scale,
			strokeCap: 'round'
		};
		var ggNeedleVector = new Point(54,0);
		var ggNeedleVectorTail = new Point(26,0);
		ggNeedleVector.angle = -90;
		ggNeedleVectorTail.angle = -90;
		var ggPitchVector = ggNeedleVector.clone();
		ggPitchVector = ggPitchVector.normalize();
		var ggNeedle = new Path.Line(ggCenter.add(ggNeedleVectorTail),ggCenter.add(ggNeedleVector));
		ggNeedle.style = ggNeedleStyle;
		ggNeedle.opacity = 0.7;
		var ggRollPlane = new Group([ggNeedle]);

		var hTickVector = new Point(18,0);
		var hTicks = new Path.Line(ggCenter.subtract(hTickVector),ggCenter.add(hTickVector));
		hTicks.style = tickStyle;
		hTicks.strokeWidth = 1*this.scale;
		hTicks.strokeCap = 'round';
		hTicks.opacity = 0.8;
		ggRollPlane.addChild(hTicks);
		var hTickOffset = new Point(0,5);
		var hTicks = new Path.Line(ggCenter.add([5,5]),ggCenter.add([-5,5]));
		hTicks.style = tickStyle;
		ggRollPlane.addChild(hTicks);
		var hTicks = new Path.Line(ggCenter.add([5,-5]),ggCenter.add([-5,-5]));
		hTicks.style = tickStyle;
		ggRollPlane.addChild(hTicks);

		ggGroup.addChild(ggRollPlane);

		// PIN
		var ggPin = new Path.Circle(ggCenter,1);
		ggPin.fillColor = 'black';
		ggGroup.addChild(ggPin);

		// GLASS
		

		// SCALE
		ggGroup.scale(this.scale,ggCenter);
		view.draw();

		this.setAtt = function(rollIn,pitchIn) {
			if (pitchIn != 0) {
				pitchIn = -1*(pitchIn/Math.abs(pitchIn))*Math.min(Math.abs(pitchIn),90);
			}
			pitch2 = pitchIn - pitch;
			angle2 = rollIn - 90 - ggNeedleVector.angle;
			ggRollPlane.rotate(angle2,ggCenter);
			ggHorizonGroup.rotate(angle2,ggCenter);
			ggNeedleVector.angle = rollIn - 90;
			pitch = pitchIn;
			var ggPitchVector = ggNeedleVector.normalize();
			ggPitchVector = ggPitchVector.multiply(pitch2*this.scale);
			ggHorizonG.translate(ggPitchVector)
			view.draw();
		}
	}

},

SpeedMeter: function() {

	this.zeroAngle = 120;
	this.maxAngle = 340;
	this.tickRadius = 50;
	this.maxSpeed = 2;
	this.scale = 1;

	this.create = function(ggCenter) {
		if (!ggCenter) {
			var ggCenter = view.center;
		}

		// FRAME
		var ggFrame = new Path.Circle(ggCenter,60);
		ggFrame.fillColor = 'gray';
		ggFrame.strokeColor = 'black';
		ggFrame.strokeWidth = 0.7*this.scale;
		var ggGroup = new Group([ggFrame]);

		//BACK
		var ggBack = new Path.Circle(ggCenter,56);
		ggBack.strokeColor = 'black';
		ggBack.strokeWidth = 0.5*this.scale;
		ggBack.fillColor = 'white';
		var ggGlow = ggBack.clone();
		var ggBounds = ggBack.bounds;
		var ggGlowGrad = new GradientColor(new Gradient(['brown','green']),ggBounds.topCenter,ggBounds.bottomCenter);
		ggGlow.fillColor = ggGlowGrad;
		ggGlow.opacity = 0.2;
		ggGlow.blendMode = 'normal';
		ggGroup.addChild(ggBack);
		ggGroup.addChild(ggGlow);

		// TEXT
		var ggText = new PointText(ggCenter.add([50,20]));
		ggText.fillcolor = 'black';
		ggText.content = '0 m/s';
		ggText.paragraphStyle.justification = 'right';
		ggGroup.addChild(ggText);
		var ggText2 = new PointText(ggCenter.subtract([0,15]));
		ggText2.fillcolor = 'black';
		ggText2.content = 'SPEED';
		ggText2.paragraphStyle.justification = 'center';
		ggText2.characterStyle = {fontSize: 7};
		ggGroup.addChild(ggText2);
		var ggText3 = new PointText(ggCenter.add([35,40]));
		ggText3.fillcolor = 'black';
		ggText3.content = 'R';
		ggText3.paragraphStyle.justification = 'right';
		ggText3.characterStyle = {fontSize: 15, font: 'sans-serif'};
		ggGroup.addChild(ggText3);

		// TICKS
		var tickStyle = {
			fillColor: 'black',
			strokeColor: 'black',
			strokeWidth: 0.5*this.scale
		};
		for (i = this.zeroAngle; i <= this.maxAngle; i += 10) {
			var tickOutside = new Point(this.tickRadius,0);
			var tickInside = new Point(this.tickRadius-10,0);
			tickOutside.angle = i;
			tickInside.angle = i;
			var tick = new Path.Line(ggCenter.add(tickInside),ggCenter.add(tickOutside));
			tick.style = tickStyle;
			ggGroup.addChild(tick);
		}

		// NEEDLE
		var ggNeedleStyle = {
			fillColor: 'red',
			strokeColor: 'red',
			strokeWidth: 2*this.scale,
			strokeCap: 'round'
		};
		var ggNeedleVector = new Point(54,0);
		var ggNeedleVectorTail = new Point(10,0);
		ggNeedleVector.angle = this.zeroAngle;
		ggNeedleVectorTail.angle = this.zeroAngle;
		var ggNeedle = new Path.Line(ggCenter.subtract(ggNeedleVectorTail),ggCenter.add(ggNeedleVector));
		ggNeedle.style = ggNeedleStyle;
		ggNeedle.opacity = 0.7;
		ggGroup.addChild(ggNeedle);

		// PIN
		var ggPin = new Path.Circle(ggCenter,1);
		ggPin.fillColor = 'black';
		ggGroup.addChild(ggPin);

		// GLASS
	

		// SCALE
		ggGroup.scale(this.scale,ggCenter);

		view.draw();

		this.setSpeed = function(speedIn) {
			if (speedIn < 0) {
				speedIn = Math.max(speedIn,-1*this.maxSpeed);
				speedIn = -1*speedIn;
				ggText3.content = 'R';
			} else {
				speedIn = Math.min(speedIn,this.maxSpeed);
				ggText3.content = '';
			}
			angle = (this.maxAngle-this.zeroAngle)*speedIn/this.maxSpeed + this.zeroAngle;
			angle2 = angle - ggNeedleVector.angle;
			ggNeedle.rotate(angle2,ggCenter);
			ggNeedleVector.angle = angle;
			ggText.content = speedIn.toFixed(1) + ' m/s';
			view.draw();
		}
	}

},

CompassMeter: function() {

	this.zeroAngle = 120;
	this.maxAngle = 340;
	this.tickRadius = 50;
	this.maxSpeed = 2;
	this.scale = 2;

	this.create = function(ggCenter) {
		if (!ggCenter) {
			var ggCenter = view.center;
		}

		// FRAME
		var ggFrame = new Path.Circle(ggCenter,60);
		ggFrame.fillColor = 'gray';
		ggFrame.strokeColor = 'black';
		ggFrame.strokeWidth = 0.7*this.scale;
		var ggGroup = new Group([ggFrame]);

		//BACK
		var ggBack = new Path.Circle(ggCenter,56);
		ggBack.strokeColor = 'black';
		ggBack.strokeWidth = 0.5*this.scale;
		ggBack.fillColor = 'white';
		var ggGlow = ggBack.clone();
		var ggBounds = ggBack.bounds;
		var ggGlowGrad = new GradientColor(new Gradient(['brown','green']),ggBounds.topCenter,ggBounds.bottomCenter);
		ggGlow.fillColor = ggGlowGrad;
		ggGlow.opacity = 0.2;
		ggGlow.blendMode = 'normal';
		ggGroup.addChild(ggBack);
		ggGroup.addChild(ggGlow);

		// TEXT
		var ggText = new PointText(ggCenter.add([0,20]));
		ggText.fillcolor = 'black';
		ggText.content = '0°';
		ggText.paragraphStyle.justification = 'center';
		ggGroup.addChild(ggText);
		var ggText2 = new PointText(ggCenter.subtract([0,12]));
		ggText2.fillcolor = 'black';
		ggText2.content = 'COMPASS';
		ggText2.paragraphStyle.justification = 'center';
		ggText2.characterStyle = {fontSize: 7};
		ggGroup.addChild(ggText2);

		// TICKS
		var tickStyle = {
			fillColor: 'black',
			strokeColor: 'black',
			strokeWidth: 0.5*this.scale
		};
		var tickLabelArr = ['NE','E','SE','S','SW','W','NW'];
		for (i = -90; i < 270; i += 15) {
			if (i==-90) {
				var tickLabel = new PointText(ggCenter.subtract([0,this.tickRadius-10]));
				tickLabel.content = 'N';
				tickLabel.characterStyle.fontSize = 12;
				tickLabel.paragraphStyle.justification = 'center';
				var tickPlane = new Group([tickLabel]);
			} else if (i%45==0) {
				var tickLabel = new PointText(ggCenter.subtract([0,this.tickRadius-10]));
				tickLabel.content = tickLabelArr[i/45+1];
				if (i%90==0) {
					tickLabel.characterStyle.fontSize = 12;
				} else {
					tickLabel.characterStyle.fontSize = 6;
				}
				tickLabel.paragraphStyle.justification = 'center';
				tickLabel.rotate(i+90,ggCenter);
				tickPlane.addChild(tickLabel);
			} else {
				var tickOutside = new Point(this.tickRadius,0);
				var tickInside = new Point(this.tickRadius-10,0);
				tickOutside.angle = i;
				tickInside.angle = i;
				var tick = new Path.Line(ggCenter.add(tickInside),ggCenter.add(tickOutside));
				tick.style = tickStyle;
				tickPlane.addChild(tick);
			}
		}
		ggGroup.addChild(tickPlane);

		// NEEDLE
		var ggNeedleStyle = {
			fillColor: 'red',
			strokeColor: 'red',
			strokeWidth: 2*this.scale,
			strokeCap: 'round'
		};
		var ggNeedleVector = new Point(54,0);
		var ggNeedleVectorTail = new Point(26,0);
		ggNeedleVector.angle = -90;
		ggNeedleVectorTail.angle = -90;
		var ggNeedle = new Path.Line(ggCenter.add(ggNeedleVectorTail),ggCenter.add(ggNeedleVector));
		ggNeedle.style = ggNeedleStyle;
		ggNeedle.opacity = 0.7;
		ggGroup.addChild(ggNeedle);
		ggNeedleVector.angle = 0; //used for rotating tickPlane

		// PIN
		var ggPin = new Path.Circle(ggCenter,1);
		ggPin.fillColor = 'black';
		ggGroup.addChild(ggPin);

		// GLASS
	

		// SCALE
		ggGroup.scale(this.scale,ggCenter);

		view.draw();

		this.setCompass = function(angle) {
			angle2 = ggNeedleVector.angle - angle;
			tickPlane.rotate(angle2,ggCenter);
			ggNeedleVector.angle = angle;
			ggText.content = angle.toFixed(0) + '°';
			view.draw();
		}
	}

},

DualMeter: function() {

	this.tickRadius = 38;
	this.zeroL = 120;
	this.zeroR = 60
	this.maxL = 100;
	this.maxR = 100;
	this.scale = 1;

	this.create = function(ggCenter) {
		if (!ggCenter) {
			var ggCenter = view.center;
		}
		var centerL = ggCenter.subtract([12,0]);
		var centerR = ggCenter.add([12,0]);

		// FRAME
		var ggFrame = new Path.Circle(ggCenter,60);
		ggFrame.fillColor = 'gray';
		ggFrame.strokeColor = 'black';
		ggFrame.strokeWidth = 0.7*this.scale;
		var ggGroup = new Group([ggFrame]);

		//BACK
		var ggBack = new Path.Circle(ggCenter,56);
		ggBack.strokeColor = 'black';
		ggBack.strokeWidth = 0.5*this.scale;
		ggBack.fillColor = 'white';
		var ggGlow = ggBack.clone();
		var ggBounds = ggBack.bounds;
		var ggGlowGrad = new GradientColor(new Gradient(['brown','green']),ggBounds.topCenter,ggBounds.bottomCenter);
		ggGlow.fillColor = ggGlowGrad;
		ggGlow.opacity = 0.2;
		ggGlow.blendMode = 'normal';
		ggGroup.addChild(ggBack);
		ggGroup.addChild(ggGlow);

		// TEXT

		var ggText2 = new PointText(centerL.subtract([0,15]));
		ggText2.fillcolor = 'black';
		ggText2.content = 'BATT';
		ggText2.paragraphStyle.justification = 'center';
		ggText2.characterStyle = {fontSize: 7};
		ggGroup.addChild(ggText2);

		var ggText3 = new PointText(centerR.add([0,15]));
		ggText3.fillcolor = 'black';
		ggText3.content = 'COMM';
		ggText3.paragraphStyle.justification = 'center';
		ggText3.characterStyle = {fontSize: 7};
		ggGroup.addChild(ggText3);

		// TICKS
		var tickStyle = {
			fillColor: 'black',
			strokeColor: 'black',
			strokeWidth: 0.5*this.scale
		};
		for (i = this.zeroL; i <= 180+(180-this.zeroL); i += 10) {
			var tickOutside = new Point(this.tickRadius,0);
			var tickInside = new Point(this.tickRadius-9,0);
			tickOutside.angle = i;
			tickInside.angle = i;
			var tick = new Path.Line(centerL.add(tickInside),centerL.add(tickOutside));
			tick.style = tickStyle;
			ggGroup.addChild(tick);
		}
		for (i = this.zeroR; i >= -this.zeroR; i -= 10) {
			var tickOutside = new Point(this.tickRadius,0);
			var tickInside = new Point(this.tickRadius-9,0);
			tickOutside.angle = i;
			tickInside.angle = i;
			var tick = new Path.Line(centerR.add(tickInside),centerR.add(tickOutside));
			tick.style = tickStyle;
			ggGroup.addChild(tick);
		}

		// NEEDLE
		var ggNeedleStyle = {
			fillColor: 'red',
			strokeColor: 'red',
			strokeWidth: 2*this.scale,
			strokeCap: 'round'
		};
		var ggNeedleVector = new Point(40,0);
		var ggNeedleVectorTail = new Point(5,0);
		ggNeedleVector.angle = this.zeroL;
		ggNeedleVectorTail.angle = this.zeroL;
		var ggNeedleL = new Path.Line(centerL.subtract(ggNeedleVectorTail),centerL.add(ggNeedleVector));
		ggNeedleL.style = ggNeedleStyle;
		ggNeedleL.opacity = 0.7;
		ggGroup.addChild(ggNeedleL);

		ggNeedleVector.angle = this.zeroR;
		ggNeedleVectorTail.angle = this.zeroR;
		var ggNeedleR = new Path.Line(centerR.subtract(ggNeedleVectorTail),centerR.add(ggNeedleVector));
		ggNeedleR.style = ggNeedleStyle;
		ggNeedleR.opacity = 0.7;
		ggGroup.addChild(ggNeedleR);

		ggNeedleVector.angle = this.zeroL; //set up for setDual()

		// PIN
		var ggPinL = new Path.Circle(centerL,1);
		ggPinL.fillColor = 'black';
		ggGroup.addChild(ggPinL);
		var ggPinR = new Path.Circle(centerR,1);
		ggPinR.fillColor = 'black';
		ggGroup.addChild(ggPinR);

		// GLASS
	

		// SCALE
		ggGroup.scale(this.scale,ggCenter);
		centerL = ggCenter.subtract([12*this.scale,0]); //adjust center
		centerR = ggCenter.add([12*this.scale,0]); //adjust center
		view.draw();

		this.setDual = function(lIn,rIn) {
			lIn = Math.min(lIn,this.maxL);
			angle = 2*(180-this.zeroL)*lIn/this.maxL + this.zeroL;
			angle2 = angle - ggNeedleVector.angle;
			ggNeedleL.rotate(angle2,centerL);
			ggNeedleVector.angle = angle;

			rIn = Math.min(rIn,this.maxR);
			angle = 2*(this.zeroR)*rIn/this.maxR + this.zeroR;
			angle2 = ggNeedleVectorTail.angle - angle;
			ggNeedleR.rotate(angle2,centerR);
			ggNeedleVectorTail.angle = angle;
			view.draw();
		}
	}

}
};

