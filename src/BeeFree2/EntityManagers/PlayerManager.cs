using Microsoft.Xna.Framework;
using BeeFree2.GameEntities;
using System;
namespace BeeFree2.EntityManagers
{
    public sealed class PlayerManager : EntityManager
    {
        /// <summary>
        /// Gets the Player associated with the game.
        /// </summary>
        public Player Player { get; private set; }

        private GamePersistanceService PersistanceService { get; set; }

        public PlayerManager()
        {
        }

        public override void Activate(Game game)
        {
            this.PersistanceService = game.Services.GetService<GamePersistanceService>();
        }

        public void CreateNewPlayer()
        {
            this.Player = new Player(new SaveSlot());
            this.Player.MarkLevelAvailable(0);

            this.SavePlayer();
        }

        /// <summary>
        /// Attempts to get the last save slot which was used.
        /// </summary>
        public bool TryGetPreviousSaveSlot(out SaveSlot saveSlot)
        {
            return 
                this.PersistanceService.TryGetLastSaveSlot(out saveSlot) &&
                this.PersistanceService.Exists(saveSlot);
        }

        public void LoadPlayer(SaveSlot saveSlot)
        {
            if (!this.PersistanceService.TryLoad(saveSlot, out var lPlayer))
            {
                this.CreateNewPlayer();
                return;
            }

            this.Player = lPlayer;

            this.SavePlayer();
        }

        public void SavePlayer()
        {
            if (this.Player != null)
            {
                this.Player.LastPlayedOn = DateTime.UtcNow;
                this.PersistanceService.Save(this.Player);
            }
        }

        public override void Unload()
        {
            this.SavePlayer();
        }
    }
}
