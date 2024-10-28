namespace BeeFree2.GameEntities
{
    public sealed class LevelData
    {
        public bool IsAvailable { get; set; }
        public bool Completed { get; set; }
        public bool CompletedFlawlessly { get; set; }
        public bool CompletedPerfectly { get; set; }

        public int PlayCount { get; set; }
        public int FailCount { get; set; }

        public void MarkComplete(bool wasFlawlessCompletion, bool wasPerfectCompletion)
        {
            this.Completed = true;
            this.CompletedFlawlessly = this.CompletedFlawlessly || wasFlawlessCompletion;
            this.CompletedPerfectly = this.CompletedPerfectly || wasPerfectCompletion;
        }

        public void MarkAvailable()
        {
            this.IsAvailable = true;
        }

        public void MarkPlayed()
        {
            this.PlayCount++;
        }
    }
}
