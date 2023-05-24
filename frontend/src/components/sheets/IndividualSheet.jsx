import { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import useGetAmount from '../../hooks/useGetAmount';
import { useHandleError } from '../../hooks/useHandleResponse';
import useConvertToCurrency from '../../hooks/useConvertToCurrency';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';
import { SheetsContext } from '../../context/SheetsContext';
import * as Switch from '@radix-ui/react-switch';
import RecordRow from './RecordRow';
import BudgetSlide from './BudgetSlide';

import style from '../../styles/sheets/individualSheet.module.css';

const IndividualSheet = () => {
	const { id: routeId } = useParams();
	const { userExists, _id } = useContext(UserContext);
	const { sheets } = useContext(SheetsContext);
	const [sheet, setSheet] = useOutletContext();

	const [recordType, setRecordType] = useState(true);
	const debitAmount = useGetAmount(sheet?.records, 'debit');
	const creditAmount = useGetAmount(sheet?.records, 'credit');

	const debitRef = useRef(null);
	const creditRef = useRef(null);
	const nodeRef = recordType ? debitRef : creditRef;

	const handleError = useHandleError();
	const convertToCurrency = useConvertToCurrency();

	const fetchSheet = async () => {
		const data = {
			_id: routeId,
			user_id: _id,
		};

		await axios
			.post(`sheet/sheets/${routeId}`, data)
			.then((response) => {
				if (response.data.success) {
					setSheet(response.data.sheet);
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};

	// Fetch sheet for direct access
	useEffect(() => {
		if (userExists && !sheet) {
			fetchSheet();
		}
	}, []);

	// Display updated sheet records
	useEffect(() => {
		setSheet(...sheets.filter((sheet) => sheet._id === routeId));
	}, [sheets]);

	return (
		<>
			{sheet && (
				<div className={style.wrapper}>
					<h2>{sheet.title}</h2>

					{/* Records section */}
					<section>
						<div className={style.firstRow}>
							<div className={style.switchRow}>
								<h3>Records</h3>
								{sheet.records.length > 0 && (
									<div className={style.recordSwitch}>
										<label htmlFor='record-type'>
											<span className={style.recordTypeLabel}>
												{recordType ? 'Debit' : 'Credit'}
											</span>
										</label>
										<Switch.Root
											className={style.recordTypeSwitchRoot}
											id='record-type'
											onCheckedChange={() => setRecordType(!recordType)}
											defaultValue={true}
										>
											<Switch.Thumb className={style.recordTypeSwitchThumb} />
										</Switch.Root>
									</div>
								)}
							</div>
						</div>

						<div className={style.recordsContent}>
							{sheet.records.length > 0 && (
								<>
									<div className={style.recordTable}>
										<div className={style.headerRow}>
											<span className={style.dateCol}>Date</span>
											<span className={style.itemCol}>Item</span>
											<span className={style.refCol}>Reference</span>
											<span className={style.amountCol}>Amount</span>
										</div>

										<SwitchTransition>
											<CSSTransition
												key={recordType}
												nodeRef={nodeRef}
												appear={true}
												mountOnEnter={true}
												unmountOnExit={true}
												addEndListener={(done) =>
													nodeRef.current.addEventListener(
														'transitionend',
														done,
														false
													)
												}
												classNames={recordType ? 'slideRight' : 'slideLeft'}
											>
												<div ref={nodeRef} className={style.recordRows}>
													{recordType
														? sheet.records
																.filter((record) => record.type === 'debit')
																.sort((a, b) => {
																	if (a.date < b.date) return -1;
																	if (a.date > b.date) return 1;
																	return 0;
																})
																.map((record) => (
																	<RecordRow
																		key={record._id}
																		record={record}
																		sheet_id={sheet._id}
																	/>
																))
														: sheet.records
																.filter((record) => record.type === 'credit')
																.sort((a, b) => {
																	if (a.date < b.date) return -1;
																	if (a.date > b.date) return 1;
																	return 0;
																})
																.map((record) => (
																	<RecordRow
																		key={record._id}
																		record={record}
																		sheet_id={sheet._id}
																	/>
																))}
												</div>
											</CSSTransition>
										</SwitchTransition>

										<div className={style.totalRow}>
											<span className={style.totalCol}>Total</span>
											<span className={style.totalAmountCol}>
												{recordType
													? debitAmount.toFixed(2)
													: creditAmount.toFixed(2)}
											</span>
										</div>
									</div>

									<div className={style.sheetTotal}>
										<div>
											<span>Debit (+)</span>
											<span>{convertToCurrency(debitAmount)}</span>
										</div>
										<div>
											<span>Credit (-)</span>
											<span>{convertToCurrency(creditAmount)}</span>
										</div>
										<div>
											<span>Balance</span>
											<span>
												{convertToCurrency(sheet.balance.$numberDecimal)}
											</span>
										</div>
									</div>
								</>
							)}

							{sheet.records.length === 0 && (
								<p className={style.emptyData}>No records added yet.</p>
							)}
						</div>
					</section>

					{/* Budgets section */}
					<section>
						<h3>Budgets</h3>

						{sheet.budgets.length > 0 && (
							<div className={style.budgetsContent}>
								<div className={style.budgetsWrapper}>
									<BudgetSlide
										budgets={sheet.budgets.filter(
											(budget) => budget.type === 'daily'
										)}
										type={'daily'}
										sheet_id={sheet._id}
									/>
									<BudgetSlide
										budgets={sheet.budgets.filter(
											(budget) => budget.type === 'weekly'
										)}
										type={'weekly'}
										sheet_id={sheet._id}
									/>
									<BudgetSlide
										budgets={sheet.budgets.filter(
											(budget) => budget.type === 'monthly'
										)}
										type={'monthly'}
										sheet_id={sheet._id}
									/>
								</div>
							</div>
						)}

						{sheet.budgets.length === 0 && (
							<p className={style.emptyData}>No budgets added yet.</p>
						)}
					</section>
				</div>
			)}
		</>
	);
};

export default IndividualSheet;
