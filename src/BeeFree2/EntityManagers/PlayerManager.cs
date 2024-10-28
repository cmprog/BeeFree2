using Microsoft.Xna.Framework;
using BeeFree2.GameEntities;
namespace BeeFree2.EntityManagers
{
    public sealed class PlayerManager : EntityManager
    {
        public SaveSlot SaveSlot { get; private set; }

        /// <summary>
        /// Gets the Player associated with the game.
        /// </summary>
        public Player Player { get; private set; }

        private GamePersistanceService PersistanceService { get; set; }

        public PlayerManager()
        {
            this.SaveSlot = SaveSlot.Max;
        }

        public override void Activate(Game game)
        {
            this.PersistanceService = game.Services.GetService<GamePersistanceService>();
        }

        public void CreateNewPlayer(SaveSlot saveSlot)
        {
            this.SaveSlot = saveSlot;

            this.Player = new Player();
            this.Player.MarkLevelAvailable(0);
        }

        public void LoadPlayer(SaveSlot saveSlot)
        {
            this.SaveSlot = saveSlot;

            if (!this.PersistanceService.TryLoad(this.SaveSlot, out var lPlayer))
            {
                this.CreateNewPlayer(saveSlot);
                return;
            }

            this.Player = lPlayer;
        }

        public void SavePlayer()
        {
            if (this.Player != null)
            {
                this.PersistanceService.Save(this.SaveSlot, this.Player);
            }
        }

        public override void Unload()
        {
            this.SavePlayer();
        }
    }
}
