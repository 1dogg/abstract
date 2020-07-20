using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Aurora.Data;
using Aurora.Data.Model;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;
using Aurora.Infrastracture.ViewModels;

namespace Aurora.Controllers
{
    public class HomeController : Controller
    { 
        public IActionResult Index()
        {
            try
            {
                return View();
            }
            catch (Exception e)
            {
                throw e;
            }
           
        }

        [Route("add")]
        public IActionResult Add()
        {
            return View();
        }

        [Route("edit/{id}")]
        public IActionResult Edit(int id)
        {
            ViewBag.Id = id;
            return View();
        }

        [Route("employee/{id}")]
        [HttpGet]
        public JsonResult GetEmployee(int id)
        {
            using (CorporationContext db = new CorporationContext())
            {
                var employee = db.Employeers.Where(e => e.EmployeeID == id)
                    .Join(db.Departments,
                        e => e.DepartmentID,
                        d => d.DepartmentID,
                        (e, d) => new EmployeeVM
                        {
                            Id = e.EmployeeID,
                            Name = e.Name,
                            Family = e.Family,
                            Sex = e.Sex.ToString(),
                            BirthDate = e.BirthDate.ToString("dd.MM.yyyy"),
                            Department = d.DepartmentName,
                            DepartmentID = e.DepartmentID,
                            ProgrammLanguageID = e.ProgrammLanguageID
                        })
                    .Join(db.ProgrammLanguages,
                        e => e.ProgrammLanguageID,
                        p => p.ProgrammLanguageID,
                        (e, p) => new EmployeeVM
                        {
                            Id = e.Id,
                            Name = e.Name,
                            Family = e.Family,
                            Sex = e.Sex,
                            BirthDate = e.BirthDate,
                            Department = e.Department,
                            ProgrammLanguage = p.Name,
                            DepartmentID = e.DepartmentID,
                            ProgrammLanguageID = e.ProgrammLanguageID
                        })
                    .FirstOrDefault();

                return Json(employee);
            }
        }

        [Route("employeers")]
        [HttpGet]
        public JsonResult GetEmployers()
        {
            using (CorporationContext db = new CorporationContext())
            {
                var employeers = db.Employeers.Where(e => e.EmployeeID > 0)
                    .Join(db.Departments,
                        e => e.DepartmentID,
                        d => d.DepartmentID,
                        (e, d) => new EmployeeVM
                        {
                            Id = e.EmployeeID,
                            Name = e.Name,
                            Family = e.Family,
                            Sex = e.Sex ? "Муж." : "Жен.",
                            BirthDate = e.BirthDate.ToString("dd.MM.yyyy"),
                            Department = d.DepartmentName,
                            DepartmentID = e.DepartmentID,
                            ProgrammLanguageID = e.ProgrammLanguageID
                        })
                    .Join(db.ProgrammLanguages,
                        e => e.ProgrammLanguageID,
                        p => p.ProgrammLanguageID,
                        (e, p) => new EmployeeVM
                        {
                            Id = e.Id,
                            Name = e.Name,
                            Family = e.Family,
                            Sex = e.Sex,
                            BirthDate = e.BirthDate,
                            Department = e.Department,
                            ProgrammLanguage = p.Name,
                            DepartmentID = e.DepartmentID,
                            ProgrammLanguageID = e.ProgrammLanguageID
                        })
                    .ToList();


                return Json(employeers);
            }
        }

        [Route("names")]
        [HttpGet]
        public JsonResult GetPopularNames()
        {
            using (CorporationContext db = new CorporationContext())
            {
                var names = db.Employeers.GroupBy(e => e.Name).Select(g => new
                {
                    Name = g.Key,
                    Count = g.Select(r => r.EmployeeID).Distinct().Count()
                })
                .OrderBy(n => n.Count)
                .ToList();

                return Json(names);
            }
        }

        [Route("families")]
        [HttpGet]
        public JsonResult GetPopularFamilies()
        {
            using (CorporationContext db = new CorporationContext())
            {
                var families = db.Employeers.GroupBy(e => e.Family).Select(g => new
                {
                    Name = g.Key,
                    Count = g.Select(r => r.EmployeeID).Distinct().Count()
                })
                .OrderBy(n => n.Count)
                .ToList();

                return Json(families);
            }
        }

        [Route("departments")]
        [HttpGet]
        public JsonResult GetDepartments(string name)
        {
            if (name == null)
            {
                name = "";
            }

            using (CorporationContext db = new CorporationContext())
            {
                var departments = db.Departments.Where(l => l.DepartmentName.Contains(name)).ToList();
                return Json(departments);
            }
        }

        [Route("programmlanguages")]
        [HttpGet]
        public JsonResult GetProgrammLanguages(string name = "")
        {
            if (name == null)
            {
                name = "";
            }
            using (CorporationContext db = new CorporationContext())
            {
                var languages = db.ProgrammLanguages.Where(l => l.Name.Contains(name)).ToList();
                return Json(languages);
            }
        }

        [Route("createorupdate")]
        [HttpPost]
        public IActionResult CreateOrUpdate([FromBody] JObject data)
        {
            try
            {
                var jsonString = data.ToString();

                var format = "dd.MM.yyyy"; // your datetime format
                var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = format };

                var employee = JsonConvert.DeserializeObject<Employee>(jsonString, dateTimeConverter);

                using (CorporationContext db = new CorporationContext())
                {
                    var dbEmployee = db.Employeers.FirstOrDefault(e => e.EmployeeID == employee.EmployeeID);

                    if (dbEmployee != null)
                    {
                        dbEmployee.Name = employee.Name;
                        dbEmployee.Family = employee.Family;
                        dbEmployee.BirthDate = employee.BirthDate;
                        dbEmployee.Sex = employee.Sex;
                        dbEmployee.ProgrammLanguageID = employee.ProgrammLanguageID;
                        dbEmployee.DepartmentID = employee.DepartmentID;

                        db.SaveChanges();
                        return NoContent();
                    }

                    db.Employeers.Add(employee);
                    db.SaveChanges();
                    return Created("/", employee);
                }
            } catch (Exception e)
            {
                throw e;
            }   
        }

        [Route("deleteemployee/{id}")]
        [HttpDelete]
        public IActionResult DeleteEmployee(int id)
        {
            try
            {
                using (CorporationContext db = new CorporationContext())
                {
                    var employee = db.Employeers.FirstOrDefault(e => e.EmployeeID == id);
                    if (employee != null)
                    {
                        db.Employeers.Remove(employee);
                        db.SaveChanges();
                        return Ok();
                    }
                    return BadRequest();
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}