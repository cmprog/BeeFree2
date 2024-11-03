using System;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace BeeFree2
{
    [JsonConverter(typeof(ParsableValueJsonConverter<SaveSlot>))]
    public readonly struct SaveSlot : IEquatable<SaveSlot>
    {
        private readonly Guid mValue;

        public SaveSlot()
            : this(Guid.NewGuid())
        {

        }

        public SaveSlot(Guid value)
        {
            this.mValue = value;
        }

        public override string ToString() => this.mValue.ToString();

        public static SaveSlot Parse(string text)
        {
            if (TryParse(text, out var lSaveSlot)) return lSaveSlot;
            throw new FormatException($"Invalid save slot '{text}'.");
        }

        public static bool TryParse(string text, out SaveSlot saveSlot)
        {
            if (!Guid.TryParse(text, out var lGuid))
            {
                saveSlot = default;
                return false;
            }

            saveSlot = new SaveSlot(lGuid);
            return true;
        }

        public bool Equals(SaveSlot other) => this.mValue == other.mValue;

        public override bool Equals([NotNullWhen(true)] object obj)
            => (obj is SaveSlot lSaveSlot) && (this.mValue == lSaveSlot.mValue);

        public override int GetHashCode() => this.mValue.GetHashCode();

        public static bool operator ==(SaveSlot a, SaveSlot b) => a.mValue == b.mValue;

        public static bool operator !=(SaveSlot a, SaveSlot b) => a.mValue != b.mValue;
    }
}
