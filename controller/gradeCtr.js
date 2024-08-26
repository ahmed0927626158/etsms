
const dbPool = require("../config/dbConfig")
const gradeModel = require("../models/grade.model")
const getGrades = (req, res) => {
    const comp_id = req.id
    try {
        dbPool.query(' SELECT id,grade,total_lt_grade FROM grade WHERE company_id=?', [comp_id], (error, result) => {

            if (error) {
                return res.status(404).send({
                    success: false,
                    "message": error
                })
            }
            return res.status(200).json({ data: result })
        });
    }
    catch (error) {
        res.status(400).send({ error: error })
    }
}

const gradeInfo = (req, res) => {
    const comp_id = req.id
    try {
        dbPool.query('SELECT g.grade,g.total_lt_grade,l.letter FROM grade AS g LEFT JOIN letter_grades AS l ON l.grade_id=g.id WHERE g.company_id=?', [comp_id], (error, result) => {
            if (error) {
                return res.status(404).send({
                    success: false,
                    "message": error
                })
            }
            const groupedData = result.reduce((acc, curr) => {
                const { grade, total_lt_grade, letter } = curr;
                if (!acc[grade]) {
                    acc[grade] = { letters: '', total_lt_grade };
                }
                acc[grade].letters += '|' + letter;
                return acc;
            }, {});
            return res.status(200).json({ data: [groupedData] })
        });
    }
    catch (error) {
        res.status(400).send({ error: error })
    }
}

const getGrade = (req, res) => {
    const { id } = req.params;
    const comp_id = req.id; // Assuming req.id contains the company ID

    try {
        const selectGrade = "SELECT g.id AS grade_id,g.grade, g.total_lt_grade AS max_section, lg.id, lg.letter FROM grade AS g LEFT JOIN letter_grades AS lg ON lg.grade_id = g.id WHERE g.grade = ? AND g.company_id = ?"
        //console
        dbPool.query(selectGrade, [id, comp_id], (error, result) => {
            if (error) {
                return res.status(404).send({
                    success: false,
                    error: error
                });
            } else if (result.length == 0) {
                console.log('errrrr')
                return res.status(404).send({
                    success: false,
                    message: "Grade not found"
                });
            }
            return res.status(200).json({ classData: result });
        });
    } catch (error) {

        res.status(400).send({ error: error });
    }
};
const getGradeOnly = (req, res) => {
    const { id } = req.params;
    const comp_id = req.id; // Assuming req.id contains the company ID
    //console.log("ddddd",id,comp_id)
    try {
        const selectGrade = "SELECT g.id AS grade_id,g.grade,g.total_lt_grade AS max_section, lg.id, lg.letter FROM grade AS g LEFT JOIN letter_grades AS lg ON lg.grade_id = g.id WHERE g.grade = ? AND g.company_id = ?"

        dbPool.query(selectGrade, [id, comp_id], (error, result) => {
            if (error) {
                return res.status(404).send({
                    success: false,
                    error: error
                });
            } else if (result.length == 0) {
                return res.status(404).send({
                    success: false,
                    message: "Grade not found"
                });
            }

            return res.status(200).json({ classData: result });
        });
    } catch (error) {

        res.status(400).send({ error: error });
    }
};
const registerGrade = (req, res) => {
    const { grade, total_lt_grade } = req.body;

    const comp_id = req.id
    try {
        gradeModel.getGrade(grade, comp_id).then((result) => {
            // if the g/rade is not exixts register
            dbPool.query('INSERT INTO grade(grade,total_lt_grade,company_id)  VALUES(?,?,?)', [grade, total_lt_grade, comp_id], (error, result) => {
                if (error) {

                    return res.status(400).json({ error: error })
                }
                return res.status(200).json({ insertedId: result.insertId, "title": grade, "total_lt_grade": total_lt_grade })
            })
        }).catch((error) => {
            return res.status(404).json({ error: error })
        })
    }
    catch (error) {
        console.log(error)
        res.status(400).send({ error: error })
    }
}
const updateLtterGrade = (req, res) => {
    const { id, section } = req.body
    const comp_id = req.id
    try {
        const selectQuery = "SELECT letter FROM letter_grades WHERE id=? AND company_id=?"
        const updateQuery = "Update letter_grades SET letter=? WHERE id=? AND company_id=?"
        dbPool.query(selectQuery, [id, comp_id], (error, result) => {
            if (error) {
                return res.status(400).json({ error: error['sqlMessage'] })
            }
            if (result.length == 0) {
                return res.status(404).json({ error: "Section not found.Please add section" })
            }
            dbPool.query(updateQuery, [section, id, comp_id], (error, result) => {
                if (error) {
                    return res.status(400).json({ error: error['sqlMessage'] })
                }
                else if (result['changedRows'] == 0) {
                    return res.status(404).json({ error: "Section not Updated. Make sure Section exists" })
                }
                return res.status(200).json({ data: result })
            })
        })
    }
    catch (error) {
        return res.status(500).json({ "error": error })
    }
}
const updateGrade = (req, res) => {
    const { id, grade_id, new_grade, max_section } = req.body;
    const comp_id = req.id;

    try {
        // Validate input
        if (!id || !new_grade) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (new_grade < 0 || new_grade > 12) {
            return res.status(400).json({ error: "Grade is not valid" });
        }

        // Check if the new grade already exists in the database
        const selectQuery = "SELECT grade FROM grade WHERE id = ? AND grade = ? AND company_id != ?";
        dbPool.query(selectQuery, [grade_id,new_grade,comp_id], (error, result) => {
            if (error) {
                return res.status(400).json({ error:"sqlMessage" });
            }
            if (result.length > 0) {
                return res.status(400).json({ error: "Grade not updated. Make sure grade exists" });
            }

            // Proceed to update the grade
            const updateQuery = "UPDATE grade SET grade = ?, total_lt_grade = ? WHERE id = ? AND company_id = ?";
            dbPool.query(updateQuery, [new_grade, max_section, grade_id, comp_id], (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.sqlMessage });
                }

                // Check if any rows were changed
                if (result.changedRows === 0) {
                    return res.status(404).json({ error: "Grade not updated. Make sure grade exists" });
                }

                return res.status(200).json({ data: result });
            });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//new
const updateGradeOnly = (req, res) => {
    const { id, grade_id, new_grade, max_section } = req.body;
    const comp_id = req.id; // Assuming req.id contains the company ID


    try {
        // Validate input
        if (!id || !new_grade) {
            return res.status(400).json({ error: "All fields are required" });
        } else if (new_grade < 0 || new_grade > 12) {
            return res.status(400).json({ error: "Grade is not valid" });
        }


        // Check if the grade exists in the database
        const selectQuery = "SELECT grade, total_lt_grade FROM grade WHERE grade = ? AND company_id = ?";
        const selectQuery2 = "SELECT grade, total_lt_grade FROM grade WHERE grade = ? AND company_id = ? AND id!=?";
        dbPool.query(selectQuery, [new_grade, comp_id], (error, result) => {
            if (error) {
                return res.status(400).json({ error: error["sqlMessage"] });
            }
            if (result.length === 0) {
                return res.status(400).json({ error: "Grade not found. Make sure grade exists" });
            }
            dbPool.query(selectQuery2,[new_grade,comp_id,id],(error,result)=>{
                if (error) {
                    return res.status(400).json({ error: error["sqlMessage"] });
                }
                if (result.length > 0) {
                    return res.status(400).json({ error: "Grade not updated. Make sure grade exists" });
                }
                // Update the grade if it doesn't match
                const updateQuery = "UPDATE grade SET grade = ?, total_lt_grade = ? WHERE id = ? AND company_id = ?";
                dbPool.query(updateQuery, [new_grade, max_section, grade_id, comp_id], (error, result) => {
                    if (error) {
                        return res.status(500).json({ error: error.message });
                    }
                    // If no rows affected or updated
                    else if (result.changedRows === 0) {
                        return res.status(404).json({ error: "Grade not updated. Make sure grade exists" });
                    }
                    return res.status(200).json({ data: result });
                });
            })
           


        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delet grade from gade table
const deleteGrade = (req, res) => {
    const { id } = req.params
    const comp_id = req.id
    const deleteQuery = "DELETE FROM grade WHERE grade=? AND company_id=?"
    try {
        dbPool.query(deleteQuery, [id, comp_id], (error, result) => {
            if (error) {

                if (error['code'] == 'ER_ROW_IS_REFERENCED_2') {
                    return res.status(400).json({ error: error['sqlMessage'] })
                }
                return res.status(400).json({ error: "Some error occured" })
            }

            if (result['affectedRows'] == 0) {
                return res.status(404).json({ error: `Grade ${id} not deleted. Make shure grade ${id} exists` })
            }
            return res.status(200).json({ data: `Grade ${id} is deleted` })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }

}
const deleteSection = (req, res) => {
    const { id } = req.body
    const deleteQuery = "DELETE FROM letter_grades WHERE id=?"
    try {
        dbPool.query(deleteQuery, [id], (error, result) => {
            if (error) {

                if (error['code'] == 'ER_ROW_IS_REFERENCED_2') {
                    return res.status(400).json({ error: error['sqlMessage'] })
                }
                return res.status(400).json({ error: "Some error occured" })
            }

            if (result['affectedRows'] == 0) {
                return res.status(404).json({ error: `Grade ${id} not deleted. Make sure grade ${id} exists` })
            }
            return res.status(200).json({ data: `Grade ${id} is deleted` })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }

}


module.exports = { getGrades, getGrade, getGradeOnly, registerGrade, updateLtterGrade, deleteGrade, deleteSection, updateGrade, updateGradeOnly, gradeInfo }