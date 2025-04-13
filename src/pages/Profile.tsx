import React, { useEffect, useState } from "react";
import { FiPlus, FiUser, FiTrash } from "react-icons/fi";
import { format } from "date-fns";
import { Education, User, WorkExperience } from "../lib/types/user";
import {
  EducationFormInputs,
  SkillsFormInputs,
  UserUpdateFormInputs,
  WorkExperienceFormInputs,
} from "../common/schemas/schemas";
import ModalWindow from "../components/ModalWindow";
import EducationForm from "../components/EducationForm";
import WorkExperienceForm from "../components/WorkExpirienceForm";
import SkillsForm from "../components/SkillsForm";
import useApi from "../lib/axiosClient";
import UserUpdateForm from "../components/UserUpdateForm";
import Loader from "../components/Loader";

const formatPeriod = (start: string, end?: string | null) => {
  try {
    const formattedStart = format(new Date(start), "dd MMM yyyy");
    const formattedEnd = end ? format(new Date(end), "dd MMM yyyy") : "Present";
    return `${formattedStart} – ${formattedEnd}`;
  } catch {
    return `${start} – ${end}`;
  }
};

const ProfilePage: React.FC = () => {
  const { getCurrentUser, updateCurrentUser, updateUserAvatar } = useApi();

  const [user, setUser] = useState<User | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showWorkExperienceForm, setShowWorkExperienceForm] = useState(false);
  const [showSkillsForm, setShowSkillsForm] = useState(false);
  const [showUserUpdateForm, setShowUserUpdateForm] = useState(false);

  const [newHobby, setNewHobby] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        setUser(fetchedUser);
        setEducations(fetchedUser.education || []);
        setWorkExperiences(fetchedUser.work_experience || []);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleEducationSubmit = async (data: EducationFormInputs) => {
    const newEducations = [...educations, data];
    try {
      const updatedUser = await updateCurrentUser({ education: newEducations });
      setUser(updatedUser);
      setEducations(updatedUser.education || newEducations);
    } catch (error) {
      console.error("Error updating education", error);
    }
    setShowEducationForm(false);
  };

  const handleWorkExperienceSubmit = async (data: WorkExperienceFormInputs) => {
    const achievementsArray = data.achievements.split(",").map((s) => s.trim());
    const newWorkExperience = { ...data, achievements: achievementsArray };
    const newWorkExperiences = [...workExperiences, newWorkExperience];
    try {
      const updatedUser = await updateCurrentUser({
        work_experience: newWorkExperiences,
      });
      setUser(updatedUser);
      setWorkExperiences(updatedUser.work_experience || newWorkExperiences);
    } catch (error) {
      console.error("Error updating work experience", error);
    }
    setShowWorkExperienceForm(false);
  };

  const handleSkillsSubmit = async (data: SkillsFormInputs) => {
    const newSkills =
      user?.skills && user.skills.length > 0
        ? [...user.skills, { name: data.groupName, skills: data.skills }]
        : [{ name: data.groupName, skills: data.skills }];
    try {
      const updatedUser = await updateCurrentUser({ skills: newSkills });
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating skills", error);
    }
    setShowSkillsForm(false);
  };

  const addHobby = async () => {
    if (!newHobby.trim()) return;
    const hobbiesArray = [...(user?.hobbies || []), newHobby.trim()];
    try {
      const updatedUser = await updateCurrentUser({ hobbies: hobbiesArray });
      setUser(updatedUser);
      setNewHobby("");
    } catch (error) {
      console.error("Error adding hobby", error);
    }
  };

  const removeHobby = async (index: number) => {
    if (!user?.hobbies) return;
    const newHobbies = user.hobbies.filter((_, i) => i !== index);
    try {
      const updatedUser = await updateCurrentUser({ hobbies: newHobbies });
      setUser(updatedUser);
    } catch (error) {
      console.error("Error removing hobby", error);
    }
  };

  const removeEducation = async (index: number) => {
    const newEducations = educations.filter((_, i) => i !== index);
    try {
      const updatedUser = await updateCurrentUser({ education: newEducations });
      setUser(updatedUser);
      setEducations(updatedUser.education || newEducations);
    } catch (error) {
      console.error("Error removing education", error);
    }
  };

  const removeWorkExperience = async (index: number) => {
    const newWorkExperiences = workExperiences.filter((_, i) => i !== index);
    try {
      const updatedUser = await updateCurrentUser({
        work_experience: newWorkExperiences,
      });
      setUser(updatedUser);
      setWorkExperiences(updatedUser.work_experience || newWorkExperiences);
    } catch (error) {
      console.error("Error removing work experience", error);
    }
  };

  const handleUserUpdateSubmit = async (data: UserUpdateFormInputs) => {
    try {
      const jsonData: Partial<User> = {
        full_name: data.full_name,
        email: data.email,
        location: data.location,
      };

      let updatedUser = await updateCurrentUser(jsonData);

      if (data.avatar) {
        const formData = new FormData();
        formData.append("avatar", data.avatar);
        updatedUser = await updateUserAvatar(formData);
      }

      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user", error);
    }
    setShowUserUpdateForm(false);
  };

  if (loading || !user) return <Loader />;

  return (
    <div className="p-6">
      {/* Profile Header */}
      <section className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser size={32} className="text-white" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-400">{user.email}</p>
            <p className="text-xl font-bold">{user.full_name}</p>
            <p className="text-gray-300">{user.location}</p>
            <button
              onClick={() => setShowUserUpdateForm(true)}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Change Profile
            </button>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Education</h2>
          <button
            onClick={() => setShowEducationForm(true)}
            className="text-green-400 hover:text-green-300"
            title="Add"
          >
            <FiPlus size={20} />
          </button>
        </div>
        {educations.map((edu, index) => (
          <div
            key={index}
            className="relative mb-6 border-b border-dashed pb-4"
          >
            <div className="absolute top-2 right-0">
              <button
                onClick={() => removeEducation(index)}
                className="text-red-400 hover:text-red-300"
                title="Delete"
              >
                <FiTrash size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-400">Level: {edu.level}</p>
            <p className="font-bold">{edu.institution}</p>
            <p>Major: {edu.major}</p>
            <p>{formatPeriod(edu.start, edu.end)}</p>
            <p>GPA: {edu.gpa}</p>
          </div>
        ))}
      </section>

      {/* Work Experience */}
      <section className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Work Experience</h2>
          <button
            onClick={() => setShowWorkExperienceForm(true)}
            className="text-green-400 hover:text-green-300"
            title="Add"
          >
            <FiPlus size={20} />
          </button>
        </div>
        {workExperiences.map((work, index) => (
          <div
            key={index}
            className="relative mb-6 border-b border-dashed pb-4"
          >
            <div className="absolute top-2 right-0">
              <button
                onClick={() => removeWorkExperience(index)}
                className="text-red-400 hover:text-red-300"
                title="Delete"
              >
                <FiTrash size={16} />
              </button>
            </div>
            <p className="font-bold text-xl">{work.position}</p>
            <p className="text-sm text-gray-400">{work.company}</p>
            <p>{work.location}</p>
            <p>{formatPeriod(work.start, work.end)}</p>
            <p className="font-semibold mt-2">Achievements:</p>
            <ul className="list-none text-sm mt-1">
              {work.achievements?.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Skills</h2>
          <button
            onClick={() => setShowSkillsForm(true)}
            className="text-green-400 hover:text-green-300"
            title="Add Skill Group"
          >
            <FiPlus size={20} />
          </button>
        </div>

        {user.skills?.length ? (
          user.skills.map((group, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-bold mb-2 text-white">
                {group.name}
              </h3>
              <ul className="space-y-3">
                {group.skills.map((skill, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-700 pb-2"
                  >
                    <span className="text-white text-base font-medium">
                      {skill.title}
                    </span>
                    {skill.description && (
                      <span className="text-gray-400 text-sm mt-1 sm:mt-0">
                        {skill.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No skills added yet.</p>
        )}
      </section>

      {/* Hobbies */}
      <section className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Hobbies</h2>
        <div className="flex flex-wrap gap-2">
          {user.hobbies?.map((hobby, index) => (
            <span
              key={index}
              className="bg-purple-600/50 text-white px-4 py-1 rounded-full flex items-center gap-2 text-sm transition hover:bg-purple-500/60"
            >
              {hobby}
              <button
                onClick={() => removeHobby(index)}
                className="text-white hover:text-gray-300 font-bold text-base"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
          <span className="bg-purple-600/40 text-white px-4 py-1 rounded-full flex items-center gap-2 text-sm">
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addHobby();
                }
              }}
              placeholder="New hobby"
              className="bg-transparent focus:outline-none text-white placeholder-white/60 w-24"
            />
            <button
              onClick={addHobby}
              className="text-white hover:text-gray-300 font-bold text-base"
              title="Add"
            >
              +
            </button>
          </span>
        </div>
      </section>

      {/* Modals */}
      {showEducationForm && (
        <ModalWindow onClose={() => setShowEducationForm(false)}>
          <EducationForm
            onSubmit={handleEducationSubmit}
            onCancel={() => setShowEducationForm(false)}
          />
        </ModalWindow>
      )}

      {showWorkExperienceForm && (
        <ModalWindow onClose={() => setShowWorkExperienceForm(false)}>
          <WorkExperienceForm
            onSubmit={handleWorkExperienceSubmit}
            onCancel={() => setShowWorkExperienceForm(false)}
          />
        </ModalWindow>
      )}

      {showSkillsForm && (
        <ModalWindow onClose={() => setShowSkillsForm(false)}>
          <SkillsForm
            onSubmit={handleSkillsSubmit}
            onCancel={() => setShowSkillsForm(false)}
          />
        </ModalWindow>
      )}

      {showUserUpdateForm && (
        <ModalWindow onClose={() => setShowUserUpdateForm(false)}>
          <UserUpdateForm
            onSubmit={handleUserUpdateSubmit}
            onCancel={() => setShowUserUpdateForm(false)}
            initialValues={{
              full_name: user.full_name,
              email: user.email,
              location: user.location,
            }}
          />
        </ModalWindow>
      )}
    </div>
  );
};

export default ProfilePage;
