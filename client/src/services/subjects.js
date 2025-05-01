
  // Define branches based on year
  export const getBranchesForYear = (year) => {
    if (year === "First Year") {
      return ["Common"];
    }
    return ["CSE", "IT", "ECE", "EEE", "ME", "CE", "CHE","MME"];
  };

  // Define subjects based on year and branch
  export const getSubjectsForYearAndBranch = (year, branch) => {
    if (year === "First Year") {
      return ["1st Semester", "2nd Semester"];
    }

    if (year === "Second Year") {
      switch (branch) {
        case "ME":
          return [
            "Math3", "FOE", "Engg Thermodynamics", "MOM", "Material Science and Engg",
            "Mechanical Drawing and CAD", "Heat Engine Lab", "MOM Lab",
            "Material Characterisation Lab", "Professional Practice Lab", "Minor 1 MOM",
            "Math4", "FOD", "Machine Design 1", "Mechanics of Machine",
            "Manufacturing Process 1", "Industrial Engg and Operation Research",
            "Mechanism of Machine Lab", "Manufacturing Techniques Lab 1",
            "Project Based Lab 1", "Minor 2 Manufacturing Process 1"
          ];
        case "CSE":
          return [
            "FOE", "Software Engg", "CSO", "TOC", "Data Communication",
            "ADA", "DSA", "DBMS", "PPL", "DCD"
          ];
        case "ECE":
          return [
            "FOE", "Digital Signal Processing", "Linear Integrated Circuit",
            "Microprocessor and Microcontroller", "EM Field and Transmission Lines",
            "Electronic Instrument and Measurement"
          ];
        case "EEE":
          return [
            "Utilisation of Electrical Energy", "Power System 1",
            "Generation of Electric Power", "Electrical Machine 2",
            "Instrumentation", "Electronics 2"
          ];
          case "CE":
          return [
            "Geotechnical Engg 1" , "Engineering Hydrology" , "Fluid Mechanics 2" , "Structure Analysis 2","Structural Design & Drawing 1","Surveying 2","Surveying Lab 2"
          ]
          case "CHE":
            return [
              "Heat Transfer 2","Mass Transfer 2", "Chemical Reaction Engineering 2","Chemical Reaction Engg-1","Mechical Operation","Heat-Transfer-1","Chemical Process Techbology-2","Mass Transfer-1","Instrumentation and Process Dynamics Control"
            ]
            case "MME":
            return [
              "Electronic and magnetic properties of material","chemical characterisation of materials ","Matlergical Kinetics","Material Testing","Fuel Furnance and Refactory","Polymeric Material"
            ]
        default:
          return ["Common Subjects"];
      }
    }

    if (year === "Third Year") {
      switch (branch) {
        case "ME":
          return [
            "Engg Management", "Machine Design 2", "IC Engine and Gas Turbine",
            "Fluid Mechanics and Hydraulic Machine", "Electrical Machines",
            "Program Electric 1A", "Fluid Mechanics Lab", "Electrical Machinery Lab",
            "IC Engine Lab", "Internship and Industrial Training", "Minor 3 IC Engine and Gas Turbine",
            "DSA", "Heat and Mass Transfer", "Turbo Machine", "Manufacturing Process 2",
            "Program Elective 2A", "Heat and Mass Transfer Lab", "Turbo Machine Lab",
            "Manufacturing Techniques Lab 2", "Project 1", "Minor 4 Heat and Mass Transfer"
          ];
        case "CSE":
          return [
            "Machine Learning", "Advance Data Structure", "NSS", "EM", "DIP"
          ];
        case "ECE":
          return [
            "EM", "DIP", "Optical Communication", "Microwave Engg"
          ];
        case "EEE":
          return [
            "Linear Control System", "Electrical Drives", "Microprocessor",
            "Departmental Elective 3rd", "Departmental Elective 4th", "Open Elective 2"
          ];
          case "CE":
            return [
              "Irrigation Engineering" , "Project Costing and Contract Management","Water Supply Engineering"
            ]
            case "CHE":
              return [
                "Process Modeling and Simulation","Transport Phenomena","Process Equipments Design Drawing-1","Department elective-3","Department elective-4","Open elective-2"
              ]
              case MME:
                return[
                  "Metal forming","Heat Treatement","Steel Making","Humanities"
                ]
        default:
          return ["Common Subjects"];
      }
    }

    return ["All Subjects"];
  };
