using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using TccLib.WinForms.Controls.Charts.Bar;

namespace TccLib.WinForms.Controls.Demo.Charts
{
    public partial class BarChartDemo : Form
    {
        private Random Rand { get; set; }
        private int LastChangeIndex { get; set; }

        public BarChartDemo()
        {
            this.Rand = new Random();
            this.LastChangeIndex = -1;

            InitializeComponent();
        }

        private float GetValue()
        {
            return this.mBarChart.MinValue + 
                ((float)this.Rand.NextDouble() * (this.mBarChart.MaxValue - this.mBarChart.MinValue));
        }

        private void ButtonAdd_Click(object sender, EventArgs e)
        {
            var lValue = this.GetValue();
            var lColor = Color.FromArgb(this.Rand.Next(256), this.Rand.Next(256), this.Rand.Next(256));

            this.mBarChart.Items.Add(new BarChartItem { Value = lValue, Color = lColor });
        }

        private void ButtonRemove_Click(object sender, EventArgs e)
        {
            if (this.mBarChart.Items.Count == 0) return;
            this.mBarChart.Items.Remove(this.mBarChart.Items.First());
        }

        private void ButtonChange_Click(object sender, EventArgs e)
        {
            if (this.mBarChart.Items.Count == 0) return;
            this.LastChangeIndex++;
            if (this.mBarChart.Items.Count <= this.LastChangeIndex) this.LastChangeIndex = 0;
            this.mBarChart.Items.Skip(this.LastChangeIndex).First().Value = this.GetValue();
        }

        private void ButtonClear_Click(object sender, EventArgs e)
        {
            this.mBarChart.Items.Clear();
        }

        private void ButtonChangeAll_Click(object sender, EventArgs e)
        {
            foreach (var litem in this.mBarChart.Items) litem.Value = this.GetValue();
        }
    }
}
