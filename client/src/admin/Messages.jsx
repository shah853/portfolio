import { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, MailOpen, RefreshCw, Search, Trash2 } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/admin/Modal';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
}

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/messages');
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(fetchMessages, 0);
    return () => window.clearTimeout(timeout);
  }, [fetchMessages]);

  const pendingCount = messages.filter((message) => !message.read).length;
  const readCount = messages.length - pendingCount;
  const filteredMessages = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return messages
      .filter((message) => {
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'pending' ? !message.read : Boolean(message.read));
        const matchesSearch =
          !query ||
          [message.name, message.email, message.subject]
            .some((value) => String(value || '').toLocaleLowerCase().includes(query));
        return matchesStatus && matchesSearch;
      })
      .sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0));
  }, [messages, search, statusFilter]);

  const updateReadStatus = async (message, read) => {
    setBusyId(message._id);
    setError('');
    try {
      const response = await api.patch(`/messages/${message._id}/${read ? 'read' : 'unread'}`);
      setMessages((current) =>
        current.map((item) => item._id === message._id ? response.data : item)
      );
      setSelectedMessage((current) =>
        current?._id === message._id ? response.data : current
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId('');
    }
  };

  const deleteMessage = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError('');
    try {
      await api.delete(`/messages/${deleteTarget._id}`);
      setMessages((current) => current.filter((item) => item._id !== deleteTarget._id));
      setSelectedMessage((current) => current?._id === deleteTarget._id ? null : current);
      setDeleteTarget(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Inbox</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Messages</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Review and manage messages submitted through your contact form.</p>
        </div>
        <Button variant="secondary" onClick={fetchMessages} disabled={loading}>
          <RefreshCw size={16} /> Refresh
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">Pending / unread</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">Read</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{readCount}</p>
        </div>
      </div>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" role="alert">
          <span>{error}</span>
          <button type="button" onClick={fetchMessages} className="font-semibold underline">Try again</button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search messages</span>
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sender, email, or subject"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label>
          <span className="sr-only">Filter messages by status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-primary sm:w-44 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All messages</option>
            <option value="pending">Pending / unread</option>
            <option value="read">Read</option>
          </select>
        </label>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="status">
          Loading messages…
        </div>
      ) : filteredMessages.length ? (
        <div className="space-y-3">
          {filteredMessages.map((message) => (
            <article key={message._id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(message)}
                  className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">{message.name || 'Unknown sender'}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${message.read ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'}`}>
                      {message.read ? 'Read' : 'Pending'}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-slate-600 dark:text-slate-300">{message.email}</span>
                  <span className="mt-3 block font-medium text-slate-900 dark:text-white">{message.subject || 'No subject'}</span>
                  <span className="mt-1 block line-clamp-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{message.message}</span>
                  <span className="mt-3 block text-xs text-slate-600 dark:text-slate-300">{formatDate(message.createdAt)}</span>
                </button>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => updateReadStatus(message, !message.read)}
                    loading={busyId === message._id}
                    disabled={Boolean(busyId)}
                    aria-label={message.read ? 'Mark message as pending' : 'Mark message as read'}
                  >
                    {message.read ? <Mail size={16} /> : <MailOpen size={16} />}
                    {message.read ? 'Mark pending' : 'Mark read'}
                  </Button>
                  <Button variant="danger" onClick={() => setDeleteTarget(message)} aria-label="Delete message">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {messages.length ? 'No messages match your search or filter.' : 'No contact messages have been received yet.'}
        </div>
      )}

      <Modal
        open={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || 'Message details'}
      >
        {selectedMessage && (
          <div className="space-y-5">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-600 dark:text-slate-300">From</dt><dd className="mt-1 font-medium text-slate-900 dark:text-white">{selectedMessage.name}</dd></div>
              <div><dt className="text-slate-600 dark:text-slate-300">Received</dt><dd className="mt-1 font-medium text-slate-900 dark:text-white">{formatDate(selectedMessage.createdAt)}</dd></div>
              <div className="sm:col-span-2"><dt className="text-slate-600 dark:text-slate-300">Email</dt><dd className="mt-1"><a className="font-medium text-primary underline" href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></dd></div>
            </dl>
            <p className="whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-800 dark:bg-slate-950 dark:text-slate-200">{selectedMessage.message}</p>
            <a
              href={`mailto:${encodeURIComponent(selectedMessage.email)}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject || 'Your message'}`)}`}
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Reply via Email
            </a>
            <p className="text-xs text-slate-600 dark:text-slate-300">This opens an email draft in your email application; the portfolio does not send or track replies.</p>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete message?"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="danger" onClick={deleteMessage} loading={deleting}>Delete</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This will permanently delete the message from {deleteTarget?.name || 'this sender'}.
        </p>
      </Modal>
    </section>
  );
}