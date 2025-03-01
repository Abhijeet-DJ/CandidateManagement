import { useState, useEffect } from "react";
import CheckedIcon from "./checked.svg";
import SearchIcon from "./search.svg";
import MoreIcon from "./three-dot.svg";
import ResumeIcon from "./res-link.svg";
import UserIcon from "./Small.png";

import "./styles.css";

const currentUser = {
  name: "John Doe",
  email: "john.doe@example.com",
};

const API_URL = "https://67c1b97f61d8935867e40bca.mockapi.io/api/v1/demo";

function Icon({ src, alt, className }) {
  return <img src={src} alt={alt} className={`w-5 h-5 ${className}`} />;
}

function OuterNavbar() {
  return (
    <div className="outer-navbar flex items-center justify-between p-4 bg-gray-200 shadow-md">
      <div className="user-Logo flex items-center gap-2">
        <Icon src={UserIcon} alt="User" />
      </div>
    </div>
  );
}

function InnerNavbar({ search, setSearch }) {
  return (
    <div className="inner-navbar flex items-center justify-between p-2 bg-gray-100 shadow-sm">
      <span>12 Candidates</span>
      <div className="search-container flex items-center gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input w-full p-2 border rounded"
        />
        <Icon src={SearchIcon} alt="Search" />
      </div>
    </div>
  );
}

function CandidateRow({ candidate, onClick, onSelect, selected }) {
  return (
    <tr className="candidate-row hover:bg-gray-100">
      <td>
        <button
          className="checkbox-btn  w-6 h-6 flex items-center justify-center border rounded-full"
          onClick={() => onSelect(candidate)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {selected ? (
            <span className="checkbox-indicator">
              <Icon
                src={CheckedIcon}
                alt="Checked"
                style={{ width: "1em", height: "1em" }}
              />
            </span>
          ) : (
            <span className="w-5 h-5 border rounded-full inline-block"></span>
          )}
        </button>
      </td>
      <td onClick={() => onClick(candidate)} className="cursor-pointer">
        {candidate.name}
        <br />
        <span className="text-gray-500 text-sm">{candidate.role}</span>
      </td>
      <td>
        <Icon src={ResumeIcon} alt="Resume" className="cursor-pointer" />
      </td>
      <td>{candidate.currentCTC}</td>
      <td>{candidate.expectedCTC}</td>
      <td>{candidate.notice}</td>
      <td>{candidate.experience}</td>
      <td>
        <Icon
          src={MoreIcon}
          alt="More Options"
          className="action-icon cursor-pointer"
        />
      </td>
    </tr>
  );
}

function CandidateTable({ candidates, onSelect, selectedCandidates, onCheck }) {
  return (
    <table className="candidate-table w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th></th>
          <th>Candidate Name</th>
          <th>Resume</th>
          <th>Current CTC</th>
          <th>Expected CTC</th>
          <th>Notice</th>
          <th>Experience</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((c, index) => (
          <CandidateRow
            key={index}
            candidate={c}
            onClick={onSelect}
            onSelect={onCheck}
            selected={selectedCandidates.includes(c)}
          />
        ))}
      </tbody>
    </table>
  );
}

// function CandidateDetails({ candidate, onBack }) {
//   return (
//     <div className="candidate-details p-6 bg-white border border-gray-200 rounded-lg shadow-md max-w-3xl mx-auto">
//       <button onClick={onBack} className="mb-4 text-blue-500">
//         Back
//       </button>
//       <h2 className="text-2xl font-bold text-gray-800">
//         {candidate.candidate_name}
//       </h2>
//       <p className="text-gray-500 text-lg mb-4">
//         {candidate.candidate_designation}
//       </p>
//       <div className="grid grid-cols-2 gap-4 text-gray-700">
//         <div>
//           <p className="font-semibold">Current CTC:</p>
//           <p>
//             {candidate.field_values?.find((f) => f.field_id === 1)
//               ?.field_value || "N/A"}
//           </p>
//         </div>
//         <div>
//           <p className="font-semibold">Expected CTC:</p>
//           <p>
//             {candidate.field_values?.find((f) => f.field_id === 2)
//               ?.field_value || "N/A"}
//           </p>
//         </div>
//         <div>
//           <p className="font-semibold">Notice Period:</p>
//           <p>
//             {candidate.field_values?.find((f) => f.field_id === 3)
//               ?.field_value || "N/A"}
//           </p>
//         </div>
//         <div>
//           <p className="font-semibold">Experience:</p>
//           <p>
//             {candidate.field_values?.find((f) => f.field_id === 4)
//               ?.field_value || "N/A"}{" "}
//             years
//           </p>
//         </div>
//       </div>
//       <a
//         href={candidate.resume_url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="mt-4 inline-block text-blue-500 underline"
//       >
//         View Resume
//       </a>
//     </div>
//   );
// }

function CandidateList() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setCandidates(data || []))
      .catch((err) => console.error("Error fetching candidates:", err));
  }, []);

  const filteredCandidates = candidates.filter((c) =>
    c.candidate_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheck = (candidate) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidate)
        ? prev.filter((c) => c !== candidate)
        : [...prev, candidate]
    );
  };

  return (
    <div className="candidate-container p-4 border rounded shadow">
      <OuterNavbar />
      <InnerNavbar search={search} setSearch={setSearch} />
      {selectedCandidate ? (
        <CandidateDetails
          candidate={selectedCandidate}
          onBack={() => setSelectedCandidate(null)}
        />
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th></th>
              <th>Candidate Name</th>
              <th>Resume</th>
              <th>Current CTC</th>
              <th>Expected CTC</th>
              <th>Notice</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((c, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td>
                  <button
                    onClick={() => handleCheck(c)}
                    className="w-6 h-6 flex items-center justify-center border rounded-full"
                  >
                    {selectedCandidates.includes(c) ? (
                      <Icon src={CheckedIcon} alt="Checked" />
                    ) : (
                      <span className="w-5 h-5 border rounded-full inline-block"></span>
                    )}
                  </button>
                </td>
                <td
                  onClick={() => setSelectedCandidate(c)}
                  className="cursor-pointer"
                >
                  {c.candidate_name || "Unknown"}
                  <br />
                  <span className="text-gray-500 text-sm">
                    {c.candidate_designation || "N/A"}
                  </span>
                </td>
                <td>
                  <a
                    href={c.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon
                      src={ResumeIcon}
                      alt="Resume"
                      className="cursor-pointer"
                    />
                  </a>
                </td>
                <td>
                  {c.field_values?.find((f) => f.field_id === 1)?.field_value ||
                    "N/A"}
                </td>
                <td>
                  {c.field_values?.find((f) => f.field_id === 2)?.field_value ||
                    "N/A"}
                </td>
                <td>
                  {c.field_values?.find((f) => f.field_id === 3)?.field_value ||
                    "N/A"}
                </td>
                <td>
                  {c.field_values?.find((f) => f.field_id === 4)?.field_value ||
                    "N/A"}
                </td>
                <td>
                  <Icon
                    src={MoreIcon}
                    alt="More Options"
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CandidateList;
