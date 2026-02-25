'use client';

import { authAPI, Team, teamAPI, User, userAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'students' | 'team' | 'individual'>('students');

  const [mounted, setMounted] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [teamEventFilter, setTeamEventFilter] = useState<string | 'all'>('all');
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<string | null>(null);
  const [selectedStudentFullData, setSelectedStudentFullData] = useState<User | null>(null);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
  const [studentRegistrations, setStudentRegistrations] = useState<Team[]>([]);
  const [loadingStudentRegistrations, setLoadingStudentRegistrations] = useState(false);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<string | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [events, setEvents] = useState<{ _id: string; name: string }[]>([]);
  const [individualRegistrations, setIndividualRegistrations] = useState<Team[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingIndividual, setLoadingIndividual] = useState(false);
  const [individualEventFilter, setIndividualEventFilter] = useState<string | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const studentsPage = 1;
  const teamsPage = 1;

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load data on mount
  useEffect(() => {
    if (mounted) {
      loadStudents();
      loadTeams();
      // Load events list for filter dropdowns
      import('@/lib/api').then(({ eventAPI }) => {
        eventAPI.getAll().then((data) => setEvents(data)).catch(() => { });
      });
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



  // Fetch full student details when modal opens
  useEffect(() => {
    if (selectedStudentDetails && !selectedStudentFullData && !loadingStudentDetails) {
      setLoadingStudentDetails(true);
      userAPI.getById(selectedStudentDetails)
        .then((fullData) => {
          setSelectedStudentFullData(fullData);
          setLoadingStudentDetails(false);
        })
        .catch((error) => {
          console.error('Error fetching student details:', error);
          setLoadingStudentDetails(false);
        });
    }
  }, [selectedStudentDetails, selectedStudentFullData, loadingStudentDetails]);

  // Fetch student registrations when modal opens
  useEffect(() => {
    if (selectedStudentDetails && !loadingStudentRegistrations) {
      setLoadingStudentRegistrations(true);
      userAPI.getRegistrations(selectedStudentDetails)
        .then((registrations) => {
          setStudentRegistrations(registrations);
          setLoadingStudentRegistrations(false);
        })
        .catch((error) => {
          console.error('Error fetching student registrations:', error);
          setLoadingStudentRegistrations(false);
        });
    }
  }, [selectedStudentDetails, loadingStudentRegistrations]);

  // Clear full data when modal closes
  useEffect(() => {
    if (!selectedStudentDetails) {
      setSelectedStudentFullData(null);
      setLoadingStudentDetails(false);
      setStudentRegistrations([]);
      setLoadingStudentRegistrations(false);
    }
  }, [selectedStudentDetails]);



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



  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/');
    }
  };





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
              { key: 'students', label: 'Students' },
              { key: 'team', label: 'Teams' },
              { key: 'individual', label: 'Individual Events' },
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
                        const leader = typeof team.teamLeader === 'object' ? team.teamLeader.name : 'Unknown';
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

        </div>
      </div>
    </div>
  );
}
