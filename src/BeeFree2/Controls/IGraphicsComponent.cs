using Microsoft.Xna.Framework;

namespace BeeFree2.Controls
{
    public interface IGraphicsComponent
    {
        /// <summary>
        /// The x-position within the UI coordinate system.
        /// </summary>
        float X { get; set; }

        /// <summary>
        /// The y-position within the UI coodinate system.
        /// </summary>
        float Y { get; set; }

        /// <summary>
        /// The x-y position within the UI coordinate system.
        /// </summary>
        Vector2 Position { get; set; }

        float Width { get; set; }

        float DesiredWidth { get; }

        float ActualWidth { get; set; }

        float MinWidth { get; set; }

        float MaxWidth { get; set; }

        float Height { get; set; }

        float DesiredHeight { get; }

        float ActualHeight { get; set; }

        float MinHeight { get; set; }

        float MaxHeight { get; set; }

        Vector2 DesiredSize { get; }

        Vector2 ActualSize { get; set; }

        float Left { get; set; }

        float Top { get; set; }

        float Right { get; set; }

        float Bottom { get; set; }

        bool IsFocused { get; set; }

        bool IsFocusable { get; set; }

        bool IsMouseOver { get; }

        Thickness Padding { get; set; }

        Thickness Margin { get; set; }

        VerticalAlignment VerticalAlignment { get; set; }

        HorizontalAlignment HorizontalAlignment { get; set; }

        Visibility Visibility { get; set; }

        IGraphicsContainer Parent { get; set; }

        /// <summary>
        /// A bounding rectangle of the component's <see cref="X"/>,
        /// <see cref="Y"/>, <see cref="ActualWidth"/>, and <see cref="ActualHeight"/>.
        /// </summary>
        RectangleF Bounds { get; set; }                

        RectangleF BorderBounds { get; }

        RectangleF ContentBounds { get; }

        Thickness BorderThickness { get; set; }

        Color BorderColor { get; set; }

        Color BackgroundColor { get; set; }

        /// <summary>
        /// Represents the bounding visible range of the component. If the component
        /// does not overflow the parent bounds, this will be the same as the bounds.
        /// </summary>
        RectangleF Clip { get; set; }

        /// <summary>
        /// Calls to update the control before input processing.
        /// </summary>
        void UpdateInitialize(GameTime gameTime);

        /// <summary>
        /// Called when needed to allow input processing.
        /// </summary>
        void UpdateInput(GraphicalUserInterface userInterface, GameTime gameTime);

        /// <summary>
        /// Final update step, useful for things that aren't input related.
        /// </summary>
        void UpdateFinalize(GameTime gameTime);

        /// <summary>
        /// Used by parents during control arrangement. Preferred sizes should be
        /// updated after this class.
        /// </summary>
        void Measure(GameTime gameTime);

        Vector2 MeasureCore(GameTime gameTime);

        /// <summary>
        /// Draws the component - should be limited to within its clip rectangle.
        /// </summary>
        void Draw(GraphicalUserInterface userInterface, GameTime gameTime);

        void DrawContent(GraphicalUserInterface userInterface, GameTime gameTime);

        /// <summary>
        /// Used for input cycling.
        /// </summary>
        IGraphicsComponent GetPreviousComponent();

        /// <summary>
        /// Used for input cycling.
        /// </summary>
        IGraphicsComponent GetNextComponent();

        /// <summary>
        /// Used for input cycling.
        /// </summary>
        IGraphicsComponent GetLastComponent();

        void ApplyAlignment(RectangleF contentBounds);
        void ApplyHorizontalAlignment(RectangleF contentBounds);
        void ApplyVerticalAlignment(RectangleF contentBounds);
    }
}
