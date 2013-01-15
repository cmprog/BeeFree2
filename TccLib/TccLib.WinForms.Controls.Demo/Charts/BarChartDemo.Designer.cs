namespace TccLib.WinForms.Controls.Demo.Charts
{
    partial class BarChartDemo
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
            this.mButtonAdd = new System.Windows.Forms.Button();
            this.mButtonRemove = new System.Windows.Forms.Button();
            this.mButtonChange = new System.Windows.Forms.Button();
            this.mButtonClear = new System.Windows.Forms.Button();
            this.mButtonChangeAll = new System.Windows.Forms.Button();
            this.mBarChart = new TccLib.WinForms.Controls.Charts.Bar.BarChart();
            this.SuspendLayout();
            // 
            // mButtonAdd
            // 
            this.mButtonAdd.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.mButtonAdd.Location = new System.Drawing.Point(633, 12);
            this.mButtonAdd.Name = "mButtonAdd";
            this.mButtonAdd.Size = new System.Drawing.Size(75, 23);
            this.mButtonAdd.TabIndex = 1;
            this.mButtonAdd.Text = "Add";
            this.mButtonAdd.UseVisualStyleBackColor = true;
            this.mButtonAdd.Click += new System.EventHandler(this.ButtonAdd_Click);
            // 
            // mButtonRemove
            // 
            this.mButtonRemove.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.mButtonRemove.Location = new System.Drawing.Point(633, 41);
            this.mButtonRemove.Name = "mButtonRemove";
            this.mButtonRemove.Size = new System.Drawing.Size(75, 23);
            this.mButtonRemove.TabIndex = 2;
            this.mButtonRemove.Text = "Remove";
            this.mButtonRemove.UseVisualStyleBackColor = true;
            this.mButtonRemove.Click += new System.EventHandler(this.ButtonRemove_Click);
            // 
            // mButtonChange
            // 
            this.mButtonChange.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.mButtonChange.Location = new System.Drawing.Point(633, 70);
            this.mButtonChange.Name = "mButtonChange";
            this.mButtonChange.Size = new System.Drawing.Size(75, 23);
            this.mButtonChange.TabIndex = 3;
            this.mButtonChange.Text = "Change";
            this.mButtonChange.UseVisualStyleBackColor = true;
            this.mButtonChange.Click += new System.EventHandler(this.ButtonChange_Click);
            // 
            // mButtonClear
            // 
            this.mButtonClear.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.mButtonClear.Location = new System.Drawing.Point(633, 128);
            this.mButtonClear.Name = "mButtonClear";
            this.mButtonClear.Size = new System.Drawing.Size(75, 23);
            this.mButtonClear.TabIndex = 4;
            this.mButtonClear.Text = "Clear";
            this.mButtonClear.UseVisualStyleBackColor = true;
            this.mButtonClear.Click += new System.EventHandler(this.ButtonClear_Click);
            // 
            // mButtonChangeAll
            // 
            this.mButtonChangeAll.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.mButtonChangeAll.Location = new System.Drawing.Point(633, 99);
            this.mButtonChangeAll.Name = "mButtonChangeAll";
            this.mButtonChangeAll.Size = new System.Drawing.Size(75, 23);
            this.mButtonChangeAll.TabIndex = 5;
            this.mButtonChangeAll.Text = "Change All";
            this.mButtonChangeAll.UseVisualStyleBackColor = true;
            this.mButtonChangeAll.Click += new System.EventHandler(this.ButtonChangeAll_Click);
            // 
            // mBarChart
            // 
            this.mBarChart.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.mBarChart.Font = new System.Drawing.Font("Showcard Gothic", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.mBarChart.GridLines = true;
            this.mBarChart.Location = new System.Drawing.Point(0, 0);
            this.mBarChart.MaxValue = 100F;
            this.mBarChart.MinValue = 0F;
            this.mBarChart.Name = "mBarChart";
            this.mBarChart.Padding = new System.Windows.Forms.Padding(10);
            this.mBarChart.Size = new System.Drawing.Size(627, 491);
            this.mBarChart.StepValue = 20F;
            this.mBarChart.TabIndex = 0;
            this.mBarChart.Title = "Test Bar Chart";
            this.mBarChart.TitleFont = new System.Drawing.Font("Showcard Gothic", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(720, 503);
            this.Controls.Add(this.mButtonChangeAll);
            this.Controls.Add(this.mButtonClear);
            this.Controls.Add(this.mButtonChange);
            this.Controls.Add(this.mButtonRemove);
            this.Controls.Add(this.mButtonAdd);
            this.Controls.Add(this.mBarChart);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);

        }

        #endregion

        private Controls.Charts.Bar.BarChart mBarChart;
        private System.Windows.Forms.Button mButtonAdd;
        private System.Windows.Forms.Button mButtonRemove;
        private System.Windows.Forms.Button mButtonChange;
        private System.Windows.Forms.Button mButtonClear;
        private System.Windows.Forms.Button mButtonChangeAll;
    }
}

