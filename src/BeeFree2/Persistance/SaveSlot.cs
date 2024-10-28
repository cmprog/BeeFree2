using System;

namespace BeeFree2
{
    public readonly struct SaveSlot
    {
        private readonly int mValue;

        public SaveSlot(int value)
        {
            if (value < 0) throw new ArgumentOutOfRangeException(nameof(value));
            if (value > 100) throw new ArgumentOutOfRangeException(nameof(value));

            this.mValue = value;
        }

        public static SaveSlot Max => new SaveSlot(99);

        public override string ToString() => this.mValue.ToString("00");

        public static implicit operator int(SaveSlot s) => s.mValue;

        public static implicit operator SaveSlot(int v) => new SaveSlot(v);
    }
}
