using BeeFree2.GameEntities.Shooting;

namespace BeeFree2.ContentData
{
    public sealed class ShootingBehaviorTemplate_Passive
    {
        public IShootingBehavior CreateBehavior() => new PassiveShooting();
    }
}
