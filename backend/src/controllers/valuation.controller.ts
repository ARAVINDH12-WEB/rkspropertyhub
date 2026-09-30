import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { createAuditLog, getClientInfo } from "../utils/audit";
import { AuthRequest } from "../middleware/auth";

export const calculateMortgage = (req: Request, res: Response) => {
  const {
    propertyPrice,
    downPayment,
    interestRateAnnual,
    loanTenureYears,
    propertyTaxAnnual = 0,
    homeInsuranceAnnual = 0,
    monthlyMaintenance = 0,
  } = req.body;

  const principal = Math.max(0, propertyPrice - downPayment);

  if (principal <= 0) {
    return res.json({
      success: true,
      data: {
        principal: 0,
        monthlyEmi: 0,
        totalInterest: 0,
        totalAmountPayable: 0,
        monthlyPropertyTax: Math.round(propertyTaxAnnual / 12),
        monthlyHomeInsurance: Math.round(homeInsuranceAnnual / 12),
        monthlyMaintenance,
        totalMonthlyPayment: Math.round((propertyTaxAnnual + homeInsuranceAnnual) / 12 + monthlyMaintenance),
        amortizationSummary: [],
      },
    });
  }

  const monthlyRate = interestRateAnnual / 12 / 100;
  const totalMonths = loanTenureYears * 12;

  // Standard EMI formula: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalAmountPayable = emi * totalMonths;
  const totalInterest = totalAmountPayable - principal;

  const monthlyTax = propertyTaxAnnual / 12;
  const monthlyInsurance = homeInsuranceAnnual / 12;
  const totalMonthlyPayment = emi + monthlyTax + monthlyInsurance + monthlyMaintenance;

  // Year-by-year amortization summary
  let balance = principal;
  const amortizationSummary = [];
  for (let year = 1; year <= loanTenureYears; year++) {
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let m = 1; m <= 12; m++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = emi - interestForMonth;
      yearlyInterest += interestForMonth;
      yearlyPrincipal += principalForMonth;
      balance = Math.max(0, balance - principalForMonth);
    }

    amortizationSummary.push({
      year,
      principalPaid: Math.round(yearlyPrincipal),
      interestPaid: Math.round(yearlyInterest),
      remainingBalance: Math.round(balance),
    });
  }

  res.json({
    success: true,
    data: {
      principal: Math.round(principal),
      downPayment,
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmountPayable: Math.round(totalAmountPayable),
      monthlyPropertyTax: Math.round(monthlyTax),
      monthlyHomeInsurance: Math.round(monthlyInsurance),
      monthlyMaintenance: Math.round(monthlyMaintenance),
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      loanToValueRatio: Number(((principal / propertyPrice) * 100).toFixed(1)),
      amortizationSummary,
    },
  });
};

export const createValuationLead = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    const {
      propertyType,
      address,
      city,
      sizeSqFt,
      bedrooms,
      bathrooms,
      expectedPrice,
      ownerName,
      ownerEmail,
      ownerPhone,
      condition,
      notes,
    } = req.body;

    const lead = await prisma.valuationLead.create({
      data: {
        propertyType,
        address,
        city,
        sizeSqFt,
        bedrooms,
        bathrooms,
        expectedPrice,
        ownerName,
        ownerEmail,
        ownerPhone,
        condition,
        notes,
      },
    });

    await createAuditLog({
      action: "VALUATION_LEAD_CREATED",
      ip,
      userAgent,
      details: { leadId: lead.id, city, propertyType, ownerEmail },
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Our property evaluation team will generate your complimentary market valuation report within 24 hours.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const listValuationLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.valuationLead.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: leads });
  } catch (error) {
    next(error);
  }
};
