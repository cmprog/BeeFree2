export class Wall extends EngineObject
{
    constructor(pos, size)
    {
        super(pos, size); // set object position and size

        this.setCollision(); // make object collide
        this.mass = 0; // make object have static physics

        // this.color = new Color(0,0,0,0); // make object invisible
    }
}