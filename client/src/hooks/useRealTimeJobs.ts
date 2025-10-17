// Custom hook for real-time job updates using Server-Sent Events (SSE)
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface JobNotification {
  type: 'new_job' | 'update_job' | 'delete_job';
  job: any;
  universityId?: string;
}

export function useRealTimeJobs(onJobUpdate: () => void) {
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connectSSE = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Clean up existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create SSE connection
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const eventSource = new EventSource(
        `${apiUrl}/university/job-notifications?token=${token}`,
        { withCredentials: false }
      );

      eventSource.onopen = () => {
        console.log('✅ Real-time connection established');
        setIsConnected(true);
        // Clear any reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const notification: JobNotification = JSON.parse(event.data);
          console.log('📩 Received job notification:', notification);

          if (notification.type === 'new_job') {
            toast.success(`🎉 New job posted: ${notification.job.title}`, {
              autoClose: 5000,
              position: 'top-right',
            });
            // Trigger data refresh
            onJobUpdate();
          } else if (notification.type === 'update_job') {
            toast.info(`Job updated: ${notification.job.title}`, {
              autoClose: 3000,
            });
            onJobUpdate();
          } else if (notification.type === 'delete_job') {
            toast.warning(`Job removed: ${notification.job.title}`, {
              autoClose: 3000,
            });
            onJobUpdate();
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ SSE connection error:', error);
        setIsConnected(false);
        eventSource.close();

        // Attempt to reconnect after 5 seconds
        console.log('Attempting to reconnect in 5 seconds...');
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSSE();
        }, 5000);
      };

      eventSourceRef.current = eventSource;
    };

    connectSSE();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [onJobUpdate]);

  return { isConnected };
}
