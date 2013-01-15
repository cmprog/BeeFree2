#region File Description
//-----------------------------------------------------------------------------
// InputState.cs
//
// Microsoft XNA Community Game Platform
// Copyright (C) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------
#endregion

using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace TccLib.Xna.GameStateManagement
{
    /// <summary>
    /// Helper for reading input from keyboard, gamepad, and touch input. This class 
    /// tracks both the current and previous state of the input devices, and implements 
    /// query methods for high level input actions such as "move up through the menu"
    /// or "pause the game".
    /// </summary>
    public class InputState
    {
        public KeyboardState CurrentKeyboardState { get; private set; }
        public KeyboardState LastKeyboardState { get; private set; }

        public MouseState CurrentMouseState { get; private set; }
        public MouseState LastMouseState { get; private set; }

        /// <summary>
        /// Constructs a new input state.
        /// </summary>
        public InputState()
        {
            this.CurrentKeyboardState = Keyboard.GetState();
            this.LastKeyboardState = Keyboard.GetState();

            this.CurrentMouseState = Mouse.GetState();
            this.LastMouseState = Mouse.GetState();
        }

        /// <summary>
        /// Reads the latest state user input.
        /// </summary>
        public void Update()
        {
            this.LastKeyboardState = this.CurrentKeyboardState;
            this.CurrentKeyboardState = Keyboard.GetState();

            this.LastMouseState = this.CurrentMouseState;
            this.CurrentMouseState = Mouse.GetState();
        }


        /// <summary>
        /// Helper for checking if a key was pressed during this update.
        /// </summary>
        public bool IsKeyPressed(Keys key)
        {
            return this.CurrentKeyboardState.IsKeyDown(key);
        }


        /// <summary>
        /// Helper for checking if a key was newly pressed during this update.
        /// </summary>
        public bool IsNewKeyPress(Keys key)
        {
            return
                this.CurrentKeyboardState.IsKeyDown(key) &&
                this.LastKeyboardState.IsKeyUp(key);
        }

        public bool IsLeftMouseClick
        {
            get
            {
                return 
                    (this.LastMouseState.LeftButton == ButtonState.Pressed) &&
                    (this.CurrentMouseState.LeftButton == ButtonState.Released);
            }
        }
    }
}
