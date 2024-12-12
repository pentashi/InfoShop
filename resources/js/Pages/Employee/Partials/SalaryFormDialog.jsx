import * as React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";
import { MenuItem, Button } from "@mui/material";

export default function SalaryFormDialog({ open, setOpen, employee, stores }) {
    const [formData, setFormData] = useState({
        employee_id: employee?.id,
        salary_date: dayjs().format("YYYY-MM-DD"),
        net_salary: "",
        salary_from: "Cash Drawer",
        store_id: 1,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const submittedFormData = new FormData(event.currentTarget);
        let formJson = Object.fromEntries(submittedFormData.entries());
        axios
            .post("/salary-records", formJson)
            .then((resp) => {
                Swal.fire({
                    title: "Success!",
                    text: resp.data.message,
                    icon: "success",
                    showConfirmButton: true,
                });
                setOpen(false)
            })
            .catch((error) => {
                console.error("Submission failed:", error.response);
                Swal.fire({
                    title: "Error!",
                    text: error.response?.data?.message || "An error occurred while saving.",
                    icon: "error",
                    showConfirmButton: true,
                });
            });
    };

    useEffect(() => {
        if (employee) {
            setFormData((prevData) => ({
                ...prevData, store_id: employee.store_id, employee_id: employee.id, net_salary: employee.salary,
            }))
        }
    }, [employee])

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
                component: "form",
                onSubmit: handleSubmit,
            }}
        >
            <DialogTitle>Salary Information</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 2 }}>

                    <input type="hidden" name="employee_id" value={formData.employee_id} />
                    <input type="hidden" name="basic_salary" value={formData.net_salary} />
                    <input type="hidden" name="employee_name" value={employee.name} />
                    <input type="hidden" name="allowances" value={0} />
                    <input type="hidden" name="deductions" value={0} />
                    <input type="hidden" name="gross_salary" value={0} />

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            id="salary_date"
                            name="salary_date"
                            label="Salary Date"
                            type="date"
                            variant="outlined"
                            required
                            value={formData.salary_date}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            id="net_salary"
                            name="net_salary"
                            label="Net Salary"
                            type="number"
                            variant="outlined"
                            required
                            value={formData.net_salary}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            id="salary_from"
                            name="salary_from"
                            label="Salary From"
                            type="text"
                            variant="outlined"
                            required
                            select
                            value={formData.salary_from}
                            onChange={handleChange}
                        >
                            <MenuItem value={'Cash Drawer'}>Cash Drawer</MenuItem>
                            <MenuItem value={'External'}>External</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            value={formData.store_id}
                            label="Store"
                            onChange={handleChange}
                            required
                            name="store_id"
                            select
                            fullWidth
                        >
                            {stores?.map((store) => (
                                <MenuItem
                                    key={store.id}
                                    value={store.id}
                                >
                                    {store.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">SAVE</Button>
            </DialogActions>
        </Dialog>
    );
}
