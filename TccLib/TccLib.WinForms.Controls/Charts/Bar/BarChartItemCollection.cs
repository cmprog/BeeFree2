using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TccLib.WinForms.Controls.Charts.Bar
{
    public class BarChartItemCollection : ICollection<BarChartItem>
    {
        public BarChartItemCollection(BarChart barChart)
        {
            this.BarChart = barChart;
            this.Items = new HashSet<BarChartItem>();
        }

        private BarChart BarChart { get; set; }
        private ICollection<BarChartItem> Items { get; set; }

        public void Add(BarChartItem item)
        {
            this.Items.Add(item);
            item.BarChart = this.BarChart;
            this.BarChart.BarChartItemAdded(item);
        }

        public void Clear()
        {
            foreach (var lItem in this) this.BarChart.BarChartItemRemoved(lItem);
            this.Items.Clear();
        }

        public bool Contains(BarChartItem item)
        {
            return this.Items.Contains(item);
        }

        public void CopyTo(BarChartItem[] array, int arrayIndex)
        {
            this.Items.CopyTo(array, arrayIndex);
        }

        public int Count
        {
            get { return this.Items.Count; }
        }

        public bool IsReadOnly
        {
            get { return false; }
        }

        public bool Remove(BarChartItem item)
        {
            var lItemFound = this.Items.Remove(item);
            if (lItemFound) this.BarChart.BarChartItemRemoved(item);
            return lItemFound;
        }

        public IEnumerator<BarChartItem> GetEnumerator()
        {
            return this.Items.GetEnumerator();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
}
