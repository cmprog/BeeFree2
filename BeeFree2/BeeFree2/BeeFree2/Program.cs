using System;

namespace BeeFree2
{
#if WINDOWS || XBOX
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            using (BeeFreeGame game = new BeeFreeGame())
            {
                game.Run();
            }
        }
    }
#endif
}

