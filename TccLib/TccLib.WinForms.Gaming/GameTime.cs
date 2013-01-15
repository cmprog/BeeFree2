using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TccLib.WinForms.Gaming
{
    public class GameTime
    {
        public TimeSpan ElapsedGameTime { get; set; }
        public bool IsRunningSlowly { get; set; }
        public TimeSpan TotalGameTime { get; set; }

        public override string ToString()
        {
            return string.Format("{0} / {1}", this.ElapsedGameTime, this.TotalGameTime);
        }
    }
}
