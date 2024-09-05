import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Table, Spinner } from 'react-bootstrap';

const JobMatcher = () => {
    const [jobseekerFile, setJobseekerFile] = useState(null);
    const [jobFile, setJobFile] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobseekerFile || !jobFile) {
            alert('Please upload both jobseeker and job CSV files.');
            return;
        }

        const formData = new FormData();
        formData.append('jobseekers', jobseekerFile);
        formData.append('jobs', jobFile);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/job_matches', formData);
            setRecommendations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('There was an error!', error);
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center">Job Match Recommendation Engine</h1>

            {/* File Upload Form */}
            <Row className="justify-content-center mt-4">
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="jobseekerFile" className="mb-3">
                            <Form.Label>Jobseeker CSV File:</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".csv"
                                onChange={(e) => setJobseekerFile(e.target.files[0])}
                            />
                        </Form.Group>

                        <Form.Group controlId="jobFile" className="mb-3">
                            <Form.Label>Job CSV File:</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".csv"
                                onChange={(e) => setJobFile(e.target.files[0])}
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Get Recommendations'}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>

            {/* Recommendations Table */}
            {recommendations.length > 0 && (
                <Row className="justify-content-center mt-5">
                    <Col md={10}>
                        <h3 className="text-center">Recommendations</h3>
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>Jobseeker ID</th>
                                    <th>Jobseeker Name</th>
                                    <th>Job ID</th>
                                    <th>Job Title</th>
                                    <th>Matching Skills</th>
                                    <th>Matching Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recommendations.map((rec, index) => (
                                    <tr key={index}>
                                        <td>{rec.jobseeker_id}</td>
                                        <td>{rec.jobseeker_name}</td>
                                        <td>{rec.job_id}</td>
                                        <td>{rec.job_title}</td>
                                        <td>{rec.matching_skill_count}</td>
                                        <td>{rec.matching_skill_percent.toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default JobMatcher;