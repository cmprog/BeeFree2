using System;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BeeFree2
{
    public sealed class ParsableValueJsonConverter<T> : JsonConverter<T>
    {
        private readonly Func<string, T> mTypeParser;

        public ParsableValueJsonConverter()
        {
            var lParseMethodInfo = typeof(T).GetMethod("Parse", BindingFlags.Static | BindingFlags.Public);
            this.mTypeParser = lParseMethodInfo.CreateDelegate<Func<string, T>>();
        }

        public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var lValueText = reader.GetString();
            return this.mTypeParser(lValueText);
        }

        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString());
        }
    }
}
