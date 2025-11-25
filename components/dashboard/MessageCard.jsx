import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../../services/messageService';
import { formatDate } from '../../utils/helpers';

const MessageCard = ({ message, page }) => {
  const [showFull, setShowFull] = useState(false);
  const [replyOpen, setReplyOpen] = useState(message.isReplied);
  const [replyText, setReplyText] = useState(message.reply || '');
  const queryClient = useQueryClient();
  const isLong = (message?.message || '').length > 240;

  const { mutate: replyMessage, isPending: isReplying } = useMutation({
    mutationFn: () =>
      messageService.replyMessage({
        messageId: message._id,
        reply: replyText.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMessages', page]);
      toast.success('Message sent successfully!');
    },
    onError: () => {
      toast.error('Failed to send message!');
    },
  });

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md  p-6 transition-all">
      {/* From row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            From
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white truncate">
              {message.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400 truncate">
              • {message.email}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(message.createdAt)}
          </p>
        </div>
      </div>

      {/* Message section (highlighted) */}
      <div className="mt-4">
        <div className="rounded-xl border border-blue-200/50 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20 p-4">
          <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {showFull || !isLong
              ? message.message
              : `${message.message.slice(0, 240)}…`}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={() => setShowFull(s => !s)}
              className="mt-3 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium"
            >
              <span>{showFull ? 'Show less' : 'Show more'}</span>
              {showFull ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4">
        {!replyOpen ? (
          <button
            type="button"
            onClick={() => setReplyOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Reply
          </button>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
              Reply message
            </label>
            <textarea
              rows={3}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={`Write a reply to ${message.name}…`}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2"
              disabled={isReplying || message.isReplied}
            />
            {!message.isReplied && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={replyMessage}
                  disabled={!replyText.trim() || isReplying}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {isReplying ? 'Sending...' : 'Send message'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyOpen(false);
                    setReplyText('');
                  }}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
