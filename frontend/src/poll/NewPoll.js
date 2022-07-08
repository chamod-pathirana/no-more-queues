import React, { Component } from 'react';
import { createFuelRequest } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
import { DatePicker, Space } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input


class NewPoll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fuelAmount: 0,
            isInvalidatedForm: true,
            date: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFuelAmountChange = this.handleFuelAmountChange.bind(this);
    }


    handleSubmit(event) {
        event.preventDefault();
        const pollData = {
            question: this.state.question.text,
            choices: this.state.choices.map(choice => {
                return { text: choice.text }
            }),
            pollLength: this.state.pollLength
        };

        createFuelRequest(pollData)
            .then(response => {
                this.props.history.push("/");
            }).catch(error => {
                if (error.status === 401) {
                    this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');
                } else {
                    notification.error({
                        message: 'No More Queues',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                }
            });
    }


    handleFuelAmountChange(value) {

        this.setState({
            fuelAmount: value
        }
            , () => {
                this.isValidatedForm();
            });

    }



    onDateChange = (date, dateString) => {
        console.log(date, dateString);
        this.setState({
            date: dateString
        }, () => {
            this.isValidatedForm();
        })
    };

    isValidatedForm = () => {
        let { fuelAmount, date } = this.state;
        console.log(fuelAmount)
        if (fuelAmount > 0 && date != null) {
            this.setState({
                isInvalidatedForm: false
            })
        }

        else {
            this.setState({
                isInvalidatedForm: true
            })

        }
    }

    render() {
        let { fuelAmount, isInvalidatedForm } = this.state;

        return (
            <div className="new-poll-container">
                <h1 className="page-title">Fuel Rquest</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">
                        <FormItem 
                           >

                            <Input
                                placeholder="amount"
                                size="large"
                                value={this.state.fuelAmount}
                                onChange={e => this.handleFuelAmountChange(e.target.value)}

                            />

                            <DatePicker
                                onChange={this.onDateChange}
                            />


                        </FormItem>
                        <FormItem className="poll-form-row">
                            <Button type="primary"
                                htmlType="submit"
                                size="large"
                                disabled={isInvalidatedForm}
                                className="create-poll-form-button">Create Fuel Request</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}


export default NewPoll;