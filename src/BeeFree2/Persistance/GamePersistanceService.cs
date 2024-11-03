using BeeFree2.GameEntities;
using System;
using System.Collections.Generic;
using System.Drawing.Text;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BeeFree2
{
    /// <summary>
    /// Responsible for saving and loading game saves.
    /// </summary>
    public sealed class GamePersistanceService
    {
        private readonly string mBaseDirectoryPath;
        private readonly JsonSerializerOptions mOptions;

        private SaveSlot mLastSaveSlot;

        public GamePersistanceService()
        {
            var lApplicationDataDirectoryPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);            
            var lBeeFreeDirectoryPath = Path.Combine(lApplicationDataDirectoryPath, "MorseCoding", "BeeFree2", "Saves");

            if (!Directory.Exists(lBeeFreeDirectoryPath))
            {
                Directory.CreateDirectory(lBeeFreeDirectoryPath);
            }

            this.mBaseDirectoryPath = lBeeFreeDirectoryPath;

            this.mOptions = new JsonSerializerOptions();
            this.mOptions.WriteIndented = true;
            this.mOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
        }

        public bool TryGetLastSaveSlot(out SaveSlot lastSaveSlot)
        {
            var lFilePath = this.GetLatestSlotFilePath();
            var lSerializedSlot = File.ReadAllText(lFilePath);
            return SaveSlot.TryParse(lSerializedSlot, out lastSaveSlot);
        }

        private void SaveLastSaveSlot(SaveSlot lastSaveSlot)
        {
            if (this.mLastSaveSlot == lastSaveSlot) return;

            var lFilePath = this.GetLatestSlotFilePath();
            File.WriteAllText(lFilePath, lastSaveSlot.ToString());
            this.mLastSaveSlot = lastSaveSlot;
        }

        /// <summary>
        /// Saves the player to the given slot.
        /// </summary>
        public void Save(Player player)
        {
            if (player == null) throw new ArgumentNullException(nameof(player));

            var lFilePath = this.GetFilePath(player.SaveSlot);
            var lSerializedPlayerData = JsonSerializer.Serialize(player, this.mOptions);
            File.WriteAllText(lFilePath, lSerializedPlayerData);

            this.SaveLastSaveSlot(player.SaveSlot);
        }

        /// <summary>
        /// Checks if there is a player saved in the given slot.
        /// </summary>
        public bool Exists(SaveSlot saveSlot) => this.TryLoad(saveSlot, out _);

        /// <summary>
        /// Tries to load the player from the given slot.
        /// </summary>
        public bool TryLoad(SaveSlot saveSlot, out Player player)
        {
            var lFilePath = this.GetFilePath(saveSlot);
            return this.TryLoad(lFilePath, out player);
        }

        private bool TryLoad(string filePath, out Player player)
        {
            try
            {
                var lSerializedPlayerData = File.ReadAllText(filePath);
                player = JsonSerializer.Deserialize<Player>(lSerializedPlayerData, this.mOptions);

                return true;
            }
            catch (IOException)
            {
                player = default;
                return false;
            }
        }

        public List<Player> GetAllPlayers()
        {
            var lEnumerationOptions = new EnumerationOptions();
            lEnumerationOptions.IgnoreInaccessible = true;
            lEnumerationOptions.ReturnSpecialDirectories = false;
            lEnumerationOptions.RecurseSubdirectories = false;

            var lPlayers = new List<Player>();
            
            foreach (var lFilePath in Directory.EnumerateFiles(this.mBaseDirectoryPath, "player_*.json", lEnumerationOptions))
            {
                if (this.TryLoad(lFilePath, out var lPlayer))
                {
                    lPlayers.Add(lPlayer);
                }
            }

            return lPlayers;
        }

        public string GetLatestSlotFilePath() => Path.Combine(this.mBaseDirectoryPath, "latest_ref");

        private string GetFilePath(SaveSlot saveSlot) => Path.Combine(this.mBaseDirectoryPath, $"player_{saveSlot}.json");
    }
}
