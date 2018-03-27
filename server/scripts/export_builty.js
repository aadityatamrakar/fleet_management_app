const fs = require('fs');
var jsonexport = require('jsonexport');
var async = require('async');
const models = require('../server').models;
const Builty = models.builty;

Builty.find()
    .then(function (all_data) {

        var print = [];
        var $headers = [
            "Company Name",
            "GR NO",
            "GR Date",
            "Delivery Point",
            "Pickup Point",
            "From City",
            "Consignee Name",
            "Consignee Address",
            "Consignee Contact",
            "Consignee GSTIN",
            "Destination",
            "Consignor Name",
            "Consignor Address",
            "Consignor Contact",
            "Consignor GSTIN",
            "Vehicle Reg",
            "Vehicle Owner",
            "Remarks",
            "Driver Name",
            "Driver Contact",
            "Package Material",
            "No of Pkg",
            "Qty",
            "UOM",
            "Pay Rate",
            "Total",
            "Paid By",
            "Freight",
            "IGST %",
            "SGST %",
            "CGST %",
            "IGST Tax",
            "CGST Tax",
            "SGST Tax",
            "Total Amount"];

        print.push($headers);
        for (let index = 0; index < all_data.length; index++) {
            data = all_data[index];
            print.push([
                data.company,
                data.gr_no,
                data.gr_date,
                data.delivery_point,
                data.pickup_point,
                data.from_city,
                data.consignee_name,
                data.consignee_address,
                data.consignee_contact,
                data.consignee_gstin,
                data.destination,
                data.consignor_name,
                data.consignor_address,
                data.consignor_contact,
                data.consignor_gstin,
                data.vehicle,
                data.vehicle_owner,
                data.remarks,
                (data.driver && data.driver.name ? data.driver.name : ""),
                (data.driver && data.driver.contact ? data.driver.contact : ""),
                data.materials && data.materials.length > 0 ? data.materials[0]['material'] : "",
                data.materials && data.materials.length > 0 ? data.materials[0]['no_of_pkg'] : "",
                data.materials && data.materials.length > 0 ? data.materials[0]['UOM'] : "",
                data.materials && data.materials.length > 0 ? data.materials[0]['rate'] : "",
                data.materials && data.materials.length > 0 ? data.materials[0]['quantity'] : "",
                data.materials && data.materials.length > 0 ? data.materials[0]['total'] : "",
                data.paid_by ? data.paid_by : "",
                data.freight ? data.freight : "",
                data.tax_percent && data.tax_percent.igst ? data.tax_percent.igst : "",
                data.tax_percent && data.tax_percent.sgst ? data.tax_percent.sgst : "",
                data.tax_percent && data.tax_percent.cgst ? data.tax_percent.cgst : "",
                data.tax && data.tax.igst ? data.tax.igst : "",
                data.tax && data.tax.sgst ? data.tax.sgst : "",
                data.tax && data.tax.cgst ? data.tax.cgst : "",
                data.total ? data.total : "",
            ]);
        }

        // var rdata = [];
        // for (i = 0; i < print.length; i++) {
        //     for (j = 0; j < $headers.length; j++) {
        //         rdata[$headers[j]] = print[i][j];
        //     }
        // }

        jsonexport(print, function (err, csv) {
            if (err) return console.log(err);
            fs.writeFileSync('export.csv', csv);
            process.exit();
        });
    })