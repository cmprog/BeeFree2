using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BeeFree2
{
    /// <summary>
    /// Batches up the removal of items.
    /// </summary>
    internal class BatchCollectionRemover<TItem> : ICollection<TItem>, IDisposable
    {
        private ICollection<TItem> Collection { get; set; }
        private ICollection<TItem> Items { get; set; }

        public BatchCollectionRemover(ICollection<TItem> collection)
        {
            this.Collection = collection;
            this.Items = new HashSet<TItem>();
        }

        public void Add(TItem item)
        {
            this.Items.Add(item);
        }

        public void AddRange(IEnumerable<TItem> items)
        {
            foreach (var lItem in items) this.Items.Add(lItem);
        }

        public void Clear()
        {
            this.Items.Clear();
        }

        public bool Contains(TItem item)
        {
            return this.Items.Contains(item);
        }

        public void CopyTo(TItem[] array, int arrayIndex)
        {
            this.Items.CopyTo(array, arrayIndex);
        }

        public int Count
        {
            get { return this.Items.Count; }
        }

        public bool IsReadOnly
        {
            get { throw new NotImplementedException(); }
        }

        public bool Remove(TItem item)
        {
            return this.Items.Remove(item);
        }

        public IEnumerator<TItem> GetEnumerator()
        {
            return this.Items.GetEnumerator();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }

        public void Dispose()
        {
            foreach (var lItem in this.Items)
            {
                this.Collection.Remove(lItem);
            }
        }
    }
}
