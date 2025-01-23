#![allow(unused)]
use rand::Rng;
use std::cmp::Ordering;
use std::fs::File;
use std::io;
use std::io::{BufRead, BufReader, ErrorKind, Write};
use std::ops::Add;

fn print_str(x: String) {
    println!("A string {}", x);
}

fn print_return_str(x: String) -> String {
    println!("A string {}", x);
    x
}

fn change_string(name: &mut String) {
    name.push_str(" Is Supper Happy");
    println!("Msg= {}", name);
}

fn main() {
    let mut str1: String = String::from("World");
    change_string(&mut str1);
    println!("{}", str1);
}
