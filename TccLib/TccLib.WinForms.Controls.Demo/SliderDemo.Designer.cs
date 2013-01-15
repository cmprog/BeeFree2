namespace TccLib.WinForms.Controls.Demo
{
    partial class SliderDemo
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.numericSlider1 = new TccLib.WinForms.Controls.Slider.NumericSlider();
            this.SuspendLayout();
            // 
            // numericSlider1
            // 
            this.numericSlider1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.numericSlider1.Location = new System.Drawing.Point(12, 12);
            this.numericSlider1.Maximum = 0;
            this.numericSlider1.Minimum = 0;
            this.numericSlider1.Name = "numericSlider1";
            this.numericSlider1.Size = new System.Drawing.Size(527, 251);
            this.numericSlider1.TabIndex = 0;
            this.numericSlider1.Text = "numericSlider1";
            this.numericSlider1.Value = 0;
            // 
            // SliderDemo
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(551, 275);
            this.Controls.Add(this.numericSlider1);
            this.Name = "SliderDemo";
            this.Text = "SliderDemo";
            this.ResumeLayout(false);

        }

        #endregion

        private Slider.NumericSlider numericSlider1;
    }
}