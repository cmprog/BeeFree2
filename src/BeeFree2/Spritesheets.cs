using Microsoft.Xna.Framework;

namespace BeeFree2
{
    public static class Spritesheets
    {
        public static class Flat
        {
            public static BoxScale Button_Gray { get; } = new BoxScale(new Rectangle(32, 128, 32, 32), 3);

            public static BoxScale Button_Gray_Active { get; } = new BoxScale(new Rectangle(32, 160, 32, 32), 3);

            public static BoxScale Button_Gray_Disabled { get; } = new BoxScale(new Rectangle(32, 192, 32, 32), 3);


            public static BoxScale Button_Blue { get; } = new BoxScale(new Rectangle(128, 128, 32, 32), 3);

            public static BoxScale Button_Blue_Active { get; } = new BoxScale(new Rectangle(128, 160, 32, 32), 3);

            public static BoxScale Button_Blue_Disabled { get; } = new BoxScale(new Rectangle(128, 192, 32, 32), 3);


            public static BoxScale Button_Gold { get; } = new BoxScale(new Rectangle(224, 128, 32, 32), 3);

            public static BoxScale Button_Gold_Active { get; } = new BoxScale(new Rectangle(224, 160, 32, 32), 3);

            public static BoxScale Button_Gold_Disabled { get; } = new BoxScale(new Rectangle(224, 192, 32, 32), 3);

            public static BoxScale GuageContainer_Blue { get; } = new BoxScale(new Rectangle(480, 74, 32, 12), 4, 5);

            public static BoxScale GuageContainer_Gold { get; } = new BoxScale(new Rectangle(481, 171, 30, 10), 3, 4);

            public static BoxScale InfoBox { get; } = new BoxScale(new Rectangle(416, 64, 32, 32), 4);
        }
    }
}
