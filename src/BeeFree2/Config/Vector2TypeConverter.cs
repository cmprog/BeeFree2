using Microsoft.Xna.Framework;
using System;
using YamlDotNet.Core;
using YamlDotNet.Core.Events;
using YamlDotNet.Serialization;

namespace BeeFree2.Config
{
    internal sealed class ColorTypeConverter : IYamlTypeConverter
    {
        public bool Accepts(Type type) => type == typeof(Color);

        public object ReadYaml(IParser parser, Type type, ObjectDeserializer rootDeserializer)
        {
            var lNode = parser.Consume<Scalar>();
            var lText = lNode.Value;

            if (string.IsNullOrEmpty(lText)) throw new Exception("Color values cannot be empty.");
            if (lText[0] != '#') throw new Exception("Only hex encoded colors supported.");

            switch (lText.Length)
            {
                case 7:
                {
                    var lRed = this.ParseHexColorToken(lText, 1);
                    var lGreen = this.ParseHexColorToken(lText, 3);
                    var lBlue = this.ParseHexColorToken(lText, 5);
                    return new Color(lRed, lGreen, lBlue);
                }

                case 9:
                {
                    var lAlpha = this.ParseHexColorToken(lText, 1);
                    var lRed = this.ParseHexColorToken(lText, 3);
                    var lGreen = this.ParseHexColorToken(lText, 5);
                    var lBlue = this.ParseHexColorToken(lText, 7);
                    return new Color(lRed, lGreen, lBlue, lAlpha);
                }

                default:
                    throw new Exception("Colors must be #rrggbb or ##aarrggbb");
            }
            
        }

        private int ParseHexColorToken(string text, int position)
        {
            var lTextSpan = text.AsSpan(position, 2);
            return int.Parse(lTextSpan, System.Globalization.NumberStyles.HexNumber);
        }

        public void WriteYaml(IEmitter emitter, object value, Type type, ObjectSerializer serializer)
            => throw new NotSupportedException();
    }

    internal sealed class Vector2TypeConverter : IYamlTypeConverter
    {
        public bool Accepts(Type type) => type == typeof(Vector2);

        public object ReadYaml(IParser parser, Type type, ObjectDeserializer rootDeserializer)
        {
            parser.Consume<MappingStart>();

            var lVector = new Vector2();

            while (!parser.Accept<MappingEnd>(out _))
            {
                var lField = parser.Consume<Scalar>();
                var lValue = parser.Consume<Scalar>();

                switch (lField.Value.ToLowerInvariant())
                {
                    case "x":
                        lVector.X = float.Parse(lValue.Value);
                        break;

                    case "y":
                        lVector.Y = float.Parse(lValue.Value);
                        break;
                }
            }

            // Consume the end of the mapping
            parser.MoveNext();

            return lVector;
        }

        public void WriteYaml(IEmitter emitter, object value, Type type, ObjectSerializer serializer)
            => throw new NotSupportedException();
    }
}
