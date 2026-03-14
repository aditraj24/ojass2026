'use client';

import EventForm from '@/components/EventForm';
import { authAPI, CreateEventData, CreateNotificationData, Event, eventAPI, Notification, notificationAPI, Team, teamAPI, User, userAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'events' | 'students' | 'ambassadors' | 'team' | 'individual' | 'notifications'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [eventSearch, setEventSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [teamEventFilter, setTeamEventFilter] = useState<string | 'all'>('all');
  const [selectedEventParticipants, setSelectedEventParticipants] = useState<string | null>(null);
  const [selectedAmbassadorReferrals, setSelectedAmbassadorReferrals] = useState<number | null>(null);
  const [ambassadorReferralsData, setAmbassadorReferralsData] = useState<Array<{ _id: string; name: string; email: string; phone: string; ojassId: string; college: string; isPaid: boolean; registeredAt: string }>>([]);
  const [loadingAmbassadorReferrals, setLoadingAmbassadorReferrals] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<string | null>(null);
  const [selectedStudentFullData, setSelectedStudentFullData] = useState<User | null>(null);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
  const [studentRegistrations, setStudentRegistrations] = useState<Team[]>([]);
  const [loadingStudentRegistrations, setLoadingStudentRegistrations] = useState(false);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<string | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [individualRegistrations, setIndividualRegistrations] = useState<Team[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingIndividual, setLoadingIndividual] = useState(false);
  const [individualEventFilter, setIndividualEventFilter] = useState<string | 'all'>('all');
  const studentsPage = 1;
  const teamsPage = 1;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState<CreateNotificationData>({ title: '', description: '' });
  const [sendingNotification, setSendingNotification] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load events on mount
  useEffect(() => {
    if (mounted) {
      loadEvents();
      loadStudents();
      loadTeams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Load students when filters change
  useEffect(() => {
    if (mounted) {
      loadStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentSearch, paymentFilter, studentsPage, mounted]);

  // Load teams when filters change
  useEffect(() => {
    if (mounted) {
      loadTeams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamEventFilter, teamsPage, mounted]);

  // Load individual registrations when filters change or section is active
  useEffect(() => {
    if (mounted && activeSection === 'individual') {
      loadIndividualRegistrations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [individualEventFilter, activeSection, mounted]);

  // Load notifications when section is active
  useEffect(() => {
    if (mounted && activeSection === 'notifications') {
      loadNotifications();
    }

  }, [activeSection, mounted]);

  // Fetch full student details when modal opens
  useEffect(() => {
    if (!selectedStudentDetails) return;
    setLoadingStudentDetails(true);
    setSelectedStudentFullData(null);
    userAPI.getById(selectedStudentDetails)
      .then((fullData) => {
        setSelectedStudentFullData(fullData);
      })
      .catch((error) => {
        console.error('Error fetching student details:', error);
      })
      .finally(() => {
        setLoadingStudentDetails(false);
      });
  }, [selectedStudentDetails]);

  // Fetch student registrations when modal opens
  useEffect(() => {
    if (!selectedStudentDetails) return;
    setLoadingStudentRegistrations(true);
    userAPI.getRegistrations(selectedStudentDetails)
      .then((registrations) => {
        setStudentRegistrations(registrations);
      })
      .catch((error) => {
        console.error('Error fetching student registrations:', error);
      })
      .finally(() => {
        setLoadingStudentRegistrations(false);
      });
  }, [selectedStudentDetails]);

  // Clear full data when modal closes
  useEffect(() => {
    if (!selectedStudentDetails) {
      setSelectedStudentFullData(null);
      setLoadingStudentDetails(false);
      setStudentRegistrations([]);
      setLoadingStudentRegistrations(false);
    }
  }, [selectedStudentDetails]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await eventAPI.getAll();
      setEvents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await userAPI.getAll({
        page: studentsPage,
        limit: 50,
        search: studentSearch,
        paymentStatus: paymentFilter,
      });
      setStudents(response.users);
    } catch (err: unknown) {
      console.error('Error loading students:', err);
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadTeams = async () => {
    try {
      setLoadingTeams(true);
      const eventId = teamEventFilter === 'all' ? undefined : teamEventFilter;
      const response = await teamAPI.getAll({
        page: teamsPage,
        limit: 50,
        eventId,
        isIndividual: 'false', // Only get teams, not individual registrations
      });
      // Filter out individual registrations
      setTeams(response.teams.filter((team) => !team.isIndividual));
    } catch (err: unknown) {
      console.error('Error loading teams:', err);
      setError(err instanceof Error ? err.message : 'Failed to load teams');
    } finally {
      setLoadingTeams(false);
    }
  };

  const loadIndividualRegistrations = async () => {
    try {
      setLoadingIndividual(true);
      const eventId = individualEventFilter === 'all' ? undefined : individualEventFilter;
      const response = await teamAPI.getAll({
        page: 1,
        limit: 1000, // Get all individual registrations
        eventId,
        isIndividual: 'true', // Only get individual registrations
      });
      setIndividualRegistrations(response.teams.filter((team) => team.isIndividual));
    } catch (err: unknown) {
      console.error('Error loading individual registrations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load individual registrations');
    } finally {
      setLoadingIndividual(false);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await notificationAPI.getAll();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (err: unknown) {
      console.error('Error loading notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleCreateNotification = async () => {
    if (!notificationForm.title || !notificationForm.description) {
      setError('Title and description are required');
      return;
    }

    try {
      setSendingNotification(true);
      setError('');
      const response = await notificationAPI.create(notificationForm);
      if (response.success) {
        setShowNotificationModal(false);
        setNotificationForm({ title: '', description: '' });
        await loadNotifications();
        alert(`Notification sent successfully! Sent to ${response.data.recipients} users. Push notifications: ${response.data.pushNotifications.sent} sent, ${response.data.pushNotifications.failed} failed.`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send notification');
    } finally {
      setSendingNotification(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/');
    }
  };

  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setShowAddEventModal(true);
  };

  const handleCloseAddEvent = () => {
    setShowAddEventModal(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowAddEventModal(true);
  };

  const handleSubmitEvent = async (eventData: CreateEventData) => {
    try {
      setSubmitting(true);
      setError('');
      if (editingEvent) {
        await eventAPI.update(editingEvent._id, eventData);
      } else {
        await eventAPI.create(eventData);
      }
      await loadEvents();
      handleCloseAddEvent();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setError('');
      await eventAPI.delete(eventId);
      await loadEvents();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      setError(message);
      alert(message);
    }
  };

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event);
  };

  const handleCloseViewEvent = () => {
    setViewingEvent(null);
  };



  // Fetch ambassador referrals when modal opens
  useEffect(() => {
    if (!selectedAmbassadorReferrals) return;
    const ambassadors = students.filter(s => s.referralCount > 0);
    const ambassador = ambassadors[selectedAmbassadorReferrals - 1];
    if (!ambassador) return;
    setLoadingAmbassadorReferrals(true);
    userAPI.getReferrals(ambassador._id)
      .then((data) => {
        setAmbassadorReferralsData(data.referredUsers);
      })
      .catch((error) => {
        console.error('Error fetching ambassador referrals:', error);
        setAmbassadorReferralsData([]);
      })
      .finally(() => {
        setLoadingAmbassadorReferrals(false);
      });
  }, [selectedAmbassadorReferrals, students]);

  // Clear referrals data when modal closes
  useEffect(() => {
    if (!selectedAmbassadorReferrals) {
      setAmbassadorReferralsData([]);
      setLoadingAmbassadorReferrals(false);
    }
  }, [selectedAmbassadorReferrals]);

  const getTeamMembers = (teamId: string) => {
    const team = teams.find(t => t._id === teamId);
    if (!team || !team.teamMembers) return [];

    return team.teamMembers.map((member) => {
      if (typeof member === 'object') {
        return member;
      }
      return students.find(s => s._id === member);
    }).filter(Boolean);
  };

  const filteredEvents = events.filter((event) => {
    if (!event || !event.name) return false;

    // If search is empty, show all events
    const searchTerm = eventSearch || '';
    if (searchTerm.trim() === '') {
      return true;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return (event.name?.toLowerCase().includes(searchLower) ?? false) ||
      (event._id?.toLowerCase().includes(searchLower) ?? false) ||
      (event.description?.toLowerCase().includes(searchLower) ?? false);
  });

  const filteredStudents = students.filter((student) => {
    const searchTerm = studentSearch || '';
    if (searchTerm.trim() === '') {
      // If no search term, only filter by payment status
      return paymentFilter === 'all' || (paymentFilter === 'paid' ? student.isPaid : !student.isPaid);
    }

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = student.name?.toLowerCase().includes(searchLower) ||
      student.ojassId?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.collegeName?.toLowerCase().includes(searchLower);

    const matchesPayment = paymentFilter === 'all' ||
      (paymentFilter === 'paid' ? student.isPaid : !student.isPaid);

    return matchesSearch && matchesPayment;
  });

  const filteredTeams = teams.filter((team) => {
    if (teamEventFilter === 'all') return true;
    const eventId = typeof team.eventId === 'object' ? team.eventId._id : team.eventId;
    return eventId === teamEventFilter;
  });

  // Prevent hydration mismatch by not rendering event-dependent content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OJASS Admin Dashboard
              </h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OJASS Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-lg shadow-md p-2 mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'events', label: 'Events' },
              { key: 'students', label: 'Students' },
              { key: 'ambassadors', label: 'Ambassadors' },
              { key: 'team', label: 'Teams' },
              { key: 'individual', label: 'Individual Events' },
              { key: 'notifications', label: 'Notifications' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key as typeof activeSection)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${activeSection === tab.key
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Events Section */}
          {activeSection === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Events</h2>
                <button
                  onClick={handleOpenAddEvent}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  + Add Event
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name, ID, or description..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading events...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No events found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvents.map((event) => (
                    <div key={event._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow relative">
                      {event.img && (
                        <img src={event.img} alt={event.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.isTeamEvent ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                          {event.isTeamEvent ? 'Team' : 'Individual'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2"><strong>Team Size:</strong> {event.teamSizeMin}-{event.teamSizeMax}</p>
                      {event.organizer && (
                        <p className="text-gray-600 mb-2"><strong>Organizer:</strong> {event.organizer}</p>
                      )}
                      {event.description && (
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2"><strong>Description:</strong> {event.description}</p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Participants Modal */}
              {selectedEventParticipants && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEventParticipants(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Participants - {events.find(e => e._id === selectedEventParticipants)?.name}
                      </h3>
                      <button
                        onClick={() => setSelectedEventParticipants(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team OJASS ID</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                              Click on an event to view participants
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* View Event Modal */}
              {viewingEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseViewEvent}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Event Details</h3>
                      <button
                        onClick={handleCloseViewEvent}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Event Image */}
                      {viewingEvent.img && (
                        <div>
                          <img
                            src={viewingEvent.img}
                            alt={viewingEvent.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                          <p className="text-gray-900 font-semibold">{viewingEvent.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${viewingEvent.isTeamEvent ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                            {viewingEvent.isTeamEvent ? 'Team Event' : 'Individual Event'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                          <p className="text-gray-900">{viewingEvent.teamSizeMin} - {viewingEvent.teamSizeMax} {viewingEvent.isTeamEvent ? 'members' : 'participant'}</p>
                        </div>
                        {viewingEvent.organizer && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                            <p className="text-gray-900">{viewingEvent.organizer}</p>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{viewingEvent.description}</p>
                      </div>

                      {/* Prizes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prizes</label>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Prize:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.total || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Winner:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.winner || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">First Runner-up:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.first_runner_up || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Second Runner-up:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.second_runner_up || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      {viewingEvent.details && viewingEvent.details.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Details</label>
                          <ul className="list-disc list-inside space-y-1 bg-gray-50 rounded-lg p-4">
                            {viewingEvent.details.map((detail, index) => (
                              <li key={index} className="text-gray-900">{detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Rules */}
                      {viewingEvent.rules && viewingEvent.rules.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rules</label>
                          <ul className="list-disc list-inside space-y-1 bg-gray-50 rounded-lg p-4">
                            {viewingEvent.rules.map((rule, index) => (
                              <li key={index} className="text-gray-900">{rule}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Event Head */}
                      {viewingEvent.event_head && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Head</label>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-900"><strong>Name:</strong> {viewingEvent.event_head.name}</p>
                            <p className="text-gray-900"><strong>Phone:</strong> {viewingEvent.event_head.Phone}</p>
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {viewingEvent.rulebookurl && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rulebook URL</label>
                            <a
                              href={viewingEvent.rulebookurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              {viewingEvent.rulebookurl}
                            </a>
                          </div>
                        )}
                        {viewingEvent.redirect && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect Path</label>
                            <p className="text-gray-900 break-all">{viewingEvent.redirect}</p>
                          </div>
                        )}
                      </div>

                      {/* Winners */}
                      {viewingEvent.winners && viewingEvent.winners.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Winners</label>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600 text-sm">{viewingEvent.winners.length} winner(s) declared</p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                          onClick={handleCloseViewEvent}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            setViewingEvent(null);
                            setEditingEvent(viewingEvent);
                            setShowAddEventModal(true);
                          }}
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                          Edit Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add/Edit Event Modal */}
              {showAddEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseAddEvent}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {editingEvent ? 'Edit Event' : 'Add New Event'}
                      </h3>
                      <button
                        onClick={handleCloseAddEvent}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <EventForm
                      event={editingEvent || undefined}
                      onSubmit={handleSubmitEvent}
                      onCancel={handleCloseAddEvent}
                      loading={submitting}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Students Section */}
          {activeSection === 'students' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Students</h2>

              {/* Search Bar and Filter */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, OJASS ID, or email..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'paid' | 'unpaid')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All</option>
                    <option value="paid">With Payment</option>
                    <option value="unpaid">Without Payment</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingStudents ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                          Loading students...
                        </td>
                      </tr>
                    ) : filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.ojassId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{student.collegeName}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                              {student.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(student.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.eventCount || 0}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            <button
                              onClick={() => setSelectedStudentDetails(student._id)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="View Details"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                          No students found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Student Details Modal */}
              {selectedStudentDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => {
                  setSelectedStudentDetails(null);
                  setSelectedStudentFullData(null);
                }}>
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Student Details
                      </h3>
                      <button
                        onClick={() => {
                          setSelectedStudentDetails(null);
                          setSelectedStudentFullData(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {(() => {
                      const studentFromList = students.find(s => s._id === selectedStudentDetails);

                      if (loadingStudentDetails) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Loading student details...</p>
                          </div>
                        );
                      }

                      const student = selectedStudentFullData || studentFromList;
                      if (!student) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Student not found</p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">OJASS ID</label>
                              <p className="text-lg font-semibold text-gray-900">{student.ojassId}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Phone</label>
                              <p className="text-lg font-semibold text-gray-900">{student.phone}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Name</label>
                              <p className="text-lg font-semibold text-gray-900">{student.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Email</label>
                              <p className="text-lg text-gray-900">{student.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">College</label>
                              <p className="text-lg text-gray-900">{student.collegeName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Payment Status</label>
                              <p className="text-lg">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${student.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                  {student.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Registration Date</label>
                              <p className="text-lg text-gray-900">{new Date(student.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Referral Count</label>
                              <p className="text-lg font-semibold text-gray-900">{student.referralCount || 0}</p>
                            </div>
                          </div>

                          {/* ID Card Section */}
                          {student.idCardImageUrl && (
                            <div className="mt-6 pt-6 border-t">
                              <label className="block text-sm font-medium text-gray-700 mb-3">ID Card</label>
                              <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                                <img
                                  src={student.idCardImageUrl}
                                  alt={`${student.name}'s ID Card`}
                                  className="max-w-full h-auto max-h-96 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                                  onClick={() => {
                                    // Open image in new tab for full view
                                    window.open(student.idCardImageUrl, '_blank');
                                  }}
                                  onError={(e) => {
                                    // Handle image load errors
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    const parent = (e.target as HTMLImageElement).parentElement;
                                    if (parent) {
                                      parent.innerHTML = '<p className="text-gray-500 text-sm">ID card image not available</p>';
                                    }
                                  }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                Click image to view in full size
                              </p>
                            </div>
                          )}
                          {!student.idCardImageUrl && (
                            <div className="mt-6 pt-6 border-t">
                              <label className="block text-sm font-medium text-gray-700 mb-3">ID Card</label>
                              <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-gray-500 text-sm">No ID card uploaded</p>
                              </div>
                            </div>
                          )}

                          {/* Event Registrations Section */}
                          <div className="mt-6 pt-6 border-t">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Event Registrations</label>
                            {loadingStudentRegistrations ? (
                              <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-gray-500 text-sm">Loading registrations...</p>
                              </div>
                            ) : studentRegistrations.length > 0 ? (
                              <div className="space-y-3">
                                {studentRegistrations.map((registration) => {
                                  const eventName = typeof registration.eventId === 'object'
                                    ? registration.eventId.name
                                    : 'Unknown Event';
                                  const isLeader = typeof registration.teamLeader === 'object'
                                    ? registration.teamLeader._id === student._id
                                    : registration.teamLeader === student._id;
                                  const role = isLeader ? 'Leader' : 'Member';
                                  const participationType = registration.isIndividual ? 'Individual' : 'Team';
                                  const teamName = registration.isIndividual ? null : (registration.teamName || 'Team');

                                  return (
                                    <div
                                      key={registration._id}
                                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-gray-900">{eventName}</h4>
                                          <div className="flex flex-wrap gap-2 mt-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${registration.isVerified === true
                                              ? 'bg-green-100 text-green-700'
                                              : 'bg-red-100 text-red-700'
                                              }`}>
                                              {registration.isVerified === true ? 'Verified' : 'Unverified'}
                                            </span>
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                              {participationType}
                                            </span>
                                            {!registration.isIndividual && (
                                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                {role}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                                        {teamName && (
                                          <p><span className="font-medium">Team:</span> {teamName}</p>
                                        )}
                                        <p>
                                          <span className="font-medium">Registered:</span>{' '}
                                          {new Date(registration.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                          })}
                                        </p>
                                        {!registration.isIndividual && typeof registration.teamMembers === 'object' && (
                                          <p>
                                            <span className="font-medium">Team Size:</span>{' '}
                                            {registration.teamMembers.length} member{registration.teamMembers.length !== 1 ? 's' : ''}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-gray-500 text-sm">No event registrations found</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ambassadors Section */}
          {activeSection === 'ambassadors' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ambassadors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.filter(s => s.referralCount > 0).map((ambassador, index) => (
                  <div key={ambassador._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{ambassador.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-2 text-sm">{ambassador.email}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Referrals:</span>
                        <span className="font-semibold">{ambassador.referralCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Paid:</span>
                        <span className="font-semibold text-green-600">{ambassador.isPaid ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">OJASS ID:</span>
                        <span className="font-semibold">{ambassador.ojassId}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAmbassadorReferrals(index + 1)}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      View Referral Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Referral Details Modal */}
              {selectedAmbassadorReferrals && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedAmbassadorReferrals(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Referral Details - {students.filter(s => s.referralCount > 0)[(selectedAmbassadorReferrals || 1) - 1]?.name || 'Unknown'}
                      </h3>
                      <button
                        onClick={() => setSelectedAmbassadorReferrals(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referral Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {loadingAmbassadorReferrals ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                                Loading referrals...
                              </td>
                            </tr>
                          ) : ambassadorReferralsData.length > 0 ? (
                            ambassadorReferralsData.map((referral) => (
                              <tr key={referral._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{referral.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.ojassId}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.email}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.college}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${referral.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {referral.isPaid ? 'Paid' : 'Unpaid'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {new Date(referral.registeredAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                                No referrals found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Team Section */}
          {activeSection === 'team' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Teams</h2>
                <select
                  value={teamEventFilter}
                  onChange={(e) => setTeamEventFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Events</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>{event.name}</option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leader</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingTeams ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                          Loading teams...
                        </td>
                      </tr>
                    ) : filteredTeams.length > 0 ? (
                      filteredTeams.map((team) => {
                        const eventName = typeof team.eventId === 'object' ? team.eventId.name : 'Unknown';
                        const leader = (team.teamLeader && typeof team.teamLeader === 'object') ? team.teamLeader.name : 'Unknown';
                        return (
                          <tr key={team._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.teamName || 'Individual'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{eventName}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{leader}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{team.teamMembers?.length || 0}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${team.isVerified === true ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {team.isVerified === true ? 'Verified' : 'Unverified'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(team.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={team.isVerified === true}
                                  onChange={async (e) => {
                                    const newValue = e.target.checked;
                                    // Optimistically update UI
                                    setTeams((prev) =>
                                      prev.map((t) =>
                                        t._id === team._id ? { ...t, isVerified: newValue } : t
                                      )
                                    );
                                    try {
                                      const { teamAPI } = await import('@/lib/api');
                                      const result = await teamAPI.update(team._id, { isVerified: newValue });
                                      // Update with server response
                                      setTeams((prev) =>
                                        prev.map((t) =>
                                          t._id === team._id ? { ...t, isVerified: result.team.isVerified ?? false } : t
                                        )
                                      );
                                    } catch (error: unknown) {
                                      console.error('Error updating team verification:', error);
                                      // Revert on error
                                      setTeams((prev) =>
                                        prev.map((t) =>
                                          t._id === team._id ? { ...t, isVerified: team.isVerified ?? false } : t
                                        )
                                      );
                                      alert(error instanceof Error ? error.message : 'Failed to update team verification status');
                                    }
                                  }}
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                  title={team.isVerified === true ? 'Unverify' : 'Verify'}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                  onClick={() => setSelectedTeamDetails(team._id)}
                                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                  title="View Details"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                          No teams found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Team Details Modal */}
              {selectedTeamDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedTeamDetails(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Team Details
                      </h3>
                      <button
                        onClick={() => setSelectedTeamDetails(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {(() => {
                      const team = teams.find(t => t._id === selectedTeamDetails);
                      if (!team) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Loading team details...</p>
                          </div>
                        );
                      }
                      const members = getTeamMembers(team._id);
                      const eventName = typeof team.eventId === 'object' ? team.eventId.name : 'Unknown Event';
                      const leader = typeof team.teamLeader === 'object' ? team.teamLeader : null;
                      return (
                        <div className="space-y-6">
                          {/* Team Information */}
                          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Team Name</label>
                              <p className="text-lg font-semibold text-gray-900">{team.teamName || 'Individual'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Team ID</label>
                              <p className="text-lg font-semibold text-gray-900">{team._id.slice(-6)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Event</label>
                              <p className="text-lg text-gray-900">{eventName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Team Leader</label>
                              <p className="text-lg text-gray-900">{leader?.name || 'Unknown'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Total Members</label>
                              <p className="text-lg font-semibold text-gray-900">{team.teamMembers?.length || 0}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Registration Date</label>
                              <p className="text-lg text-gray-900">{new Date(team.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-gray-500">Verification Status</label>
                              <input
                                type="checkbox"
                                checked={team.isVerified === true}
                                onChange={async (e) => {
                                  const newValue = e.target.checked;
                                  // Optimistically update UI
                                  setTeams((prev) =>
                                    prev.map((t) =>
                                      t._id === team._id ? { ...t, isVerified: newValue } : t
                                    )
                                  );
                                  try {
                                    const { teamAPI } = await import('@/lib/api');
                                    const result = await teamAPI.update(team._id, { isVerified: newValue });
                                    // Update with server response
                                    setTeams((prev) =>
                                      prev.map((t) =>
                                        t._id === team._id ? { ...t, isVerified: result.team.isVerified ?? false } : t
                                      )
                                    );
                                  } catch (error: unknown) {
                                    console.error('Error updating team verification:', error);
                                    // Revert on error
                                    setTeams((prev) =>
                                      prev.map((t) =>
                                        t._id === team._id ? { ...t, isVerified: team.isVerified ?? false } : t
                                      )
                                    );
                                    alert(error instanceof Error ? error.message : 'Failed to update team verification status');
                                  }
                                }}
                                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">
                                {team.isVerified === true ? 'Verified' : 'Not Verified'}
                              </span>
                            </div>
                          </div>

                          {/* Team Members */}
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Team Members</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {members.length > 0 ? (
                                    members.slice(0, 5).map((member, idx) => (
                                      <tr key={typeof member === 'object' ? member._id : `${member}-${idx}`} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {typeof member === 'object' ? member._id?.slice(-6) : ((member as unknown as string)?.slice(-6) || 'N/A')}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {typeof member === 'object' ? member.ojassId : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {typeof member === 'object' ? member.name : 'Unknown'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                          {typeof member === 'object' ? member.email : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                          {typeof member === 'object' ? member.collegeName : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          {(() => {
                                            // Get payment status from member object or find in students array
                                            let isPaid = false;
                                            if (typeof member === 'object') {
                                              isPaid = member.isPaid || false;
                                            } else {
                                              const student = students.find(s => s._id === member);
                                              isPaid = student?.isPaid || false;
                                            }
                                            return (
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {isPaid ? 'Paid' : 'Unpaid'}
                                              </span>
                                            );
                                          })()}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No members found.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Individual Events Section */}
          {activeSection === 'individual' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Individual Event Registrations</h2>
                <select
                  value={individualEventFilter}
                  onChange={(e) => setIndividualEventFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Events</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>{event.name}</option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingIndividual ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                          Loading individual registrations...
                        </td>
                      </tr>
                    ) : individualRegistrations.length > 0 ? (
                      individualRegistrations
                        .filter((reg) => {
                          if (individualEventFilter === 'all') return true;
                          const eventId = typeof reg.eventId === 'object' ? reg.eventId._id : reg.eventId;
                          return eventId === individualEventFilter;
                        })
                        .map((reg) => {
                          const eventName = typeof reg.eventId === 'object' ? reg.eventId.name : 'Unknown Event';
                          const participant = typeof reg.teamLeader === 'object' ? reg.teamLeader : null;
                          return (
                            <tr key={reg._id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{eventName}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{participant?.name || 'Unknown'}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{participant?.ojassId || 'N/A'}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{participant?.email || 'N/A'}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${participant?.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                  {participant?.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${reg.isVerified === true ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                  {reg.isVerified === true ? 'Verified' : 'Unverified'}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(reg.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={reg.isVerified === true}
                                    onChange={async (e) => {
                                      const newValue = e.target.checked;
                                      // Optimistically update UI
                                      setIndividualRegistrations((prev) =>
                                        prev.map((r) =>
                                          r._id === reg._id ? { ...r, isVerified: newValue } : r
                                        )
                                      );
                                      try {
                                        const { teamAPI } = await import('@/lib/api');
                                        const result = await teamAPI.update(reg._id, { isVerified: newValue });
                                        // Update with server response
                                        setIndividualRegistrations((prev) =>
                                          prev.map((r) =>
                                            r._id === reg._id ? { ...r, isVerified: result.team.isVerified ?? false } : r
                                          )
                                        );
                                      } catch (error: unknown) {
                                        console.error('Error updating registration verification:', error);
                                        // Revert on error
                                        setIndividualRegistrations((prev) =>
                                          prev.map((r) =>
                                            r._id === reg._id ? { ...r, isVerified: reg.isVerified ?? false } : r
                                          )
                                        );
                                        alert(error instanceof Error ? error.message : 'Failed to update verification status');
                                      }
                                    }}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                    title={reg.isVerified === true ? 'Unverify' : 'Verify'}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <button
                                    onClick={() => setSelectedTeamDetails(reg._id)}
                                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                    title="View Details"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                          No individual registrations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Individual Registration Details Modal */}
              {selectedTeamDetails && individualRegistrations.find(r => r._id === selectedTeamDetails) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedTeamDetails(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Individual Registration Details
                      </h3>
                      <button
                        onClick={() => setSelectedTeamDetails(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {(() => {
                      const reg = individualRegistrations.find(r => r._id === selectedTeamDetails);
                      if (!reg) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Loading registration details...</p>
                          </div>
                        );
                      }
                      const eventName = typeof reg.eventId === 'object' ? reg.eventId.name : 'Unknown Event';
                      const participant = typeof reg.teamLeader === 'object' ? reg.teamLeader : null;
                      return (
                        <div className="space-y-6">
                          {/* Registration Information */}
                          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Event</label>
                              <p className="text-lg font-semibold text-gray-900">{eventName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Registration ID</label>
                              <p className="text-lg font-semibold text-gray-900">{reg._id.slice(-6)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Participant</label>
                              <p className="text-lg text-gray-900">{participant?.name || 'Unknown'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Registration Date</label>
                              <p className="text-lg text-gray-900">{new Date(reg.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-gray-500">Verification Status</label>
                              <input
                                type="checkbox"
                                checked={reg.isVerified === true}
                                onChange={async (e) => {
                                  const newValue = e.target.checked;
                                  // Optimistically update UI
                                  setIndividualRegistrations((prev) =>
                                    prev.map((r) =>
                                      r._id === reg._id ? { ...r, isVerified: newValue } : r
                                    )
                                  );
                                  try {
                                    const { teamAPI } = await import('@/lib/api');
                                    const result = await teamAPI.update(reg._id, { isVerified: newValue });
                                    // Update with server response
                                    setIndividualRegistrations((prev) =>
                                      prev.map((r) =>
                                        r._id === reg._id ? { ...r, isVerified: result.team.isVerified ?? false } : r
                                      )
                                    );
                                  } catch (error: unknown) {
                                    console.error('Error updating registration verification:', error);
                                    // Revert on error
                                    setIndividualRegistrations((prev) =>
                                      prev.map((r) =>
                                        r._id === reg._id ? { ...r, isVerified: reg.isVerified ?? false } : r
                                      )
                                    );
                                    alert(error instanceof Error ? error.message : 'Failed to update verification status');
                                  }
                                }}
                                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">
                                {reg.isVerified === true ? 'Verified' : 'Not Verified'}
                              </span>
                            </div>
                          </div>

                          {/* Participant Details */}
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Participant Details</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Name</label>
                                  <p className="text-sm text-gray-900">{participant?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">OJASS ID</label>
                                  <p className="text-sm text-gray-900">{participant?.ojassId || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Email</label>
                                  <p className="text-sm text-gray-900">{participant?.email || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">College</label>
                                  <p className="text-sm text-gray-900">{participant?.collegeName || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Payment Status</label>
                                  <p className="text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${participant?.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                      }`}>
                                      {participant?.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
                <button
                  onClick={() => {
                    setShowNotificationModal(true);
                    setNotificationForm({ title: '', description: '' });
                    setError('');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  + Send Notification
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {loadingNotifications ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">Loading notifications...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No notifications sent yet.</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{notification.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                Sent: {new Date(notification.createdAt).toLocaleString()}
                              </span>
                              {notification.recipients && notification.recipients.length > 0 && (
                                <span>
                                  Recipients: {notification.recipients.length} user(s)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Send Notification</h2>
                <button
                  onClick={() => {
                    setShowNotificationModal(false);
                    setNotificationForm({ title: '', description: '' });
                    setError('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={notificationForm.description}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, description: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter notification description"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This notification will be sent to all users as a push notification and stored in their dashboard.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowNotificationModal(false);
                      setNotificationForm({ title: '', description: '' });
                      setError('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    disabled={sendingNotification}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNotification}
                    disabled={sendingNotification || !notificationForm.title || !notificationForm.description}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingNotification ? 'Sending...' : 'Send Notification'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
